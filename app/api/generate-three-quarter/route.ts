import { NextRequest, NextResponse } from "next/server";
import { buildThreeQuarterPrompt } from "@/lib/prompts/three-quarter-prompt";

type ProductType = "wall-art" | "shelf";

export async function POST(request: NextRequest) {
  try {
    const { image, productType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!productType) {
      return NextResponse.json(
        { error: "No product type provided" },
        { status: 400 }
      );
    }

    if (productType !== "wall-art" && productType !== "shelf") {
      return NextResponse.json(
        { error: "Invalid product type. Must be 'wall-art' or 'shelf'" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = "gemini-3.1-flash-image-preview";
    const aspectRatio = process.env.GEMINI_ASPECT_RATIO || "1:1";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    let base64Image = image;
    let mimeType = "image/png";

    if (image.includes(",")) {
      const parts = image.split(",");
      base64Image = parts[1];
      const mimeMatch = parts[0].match(/data:([^;]+);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    }

    const prompt = buildThreeQuarterPrompt(productType as ProductType);

    // Multi-turn structure to decouple scene memorisation from angle change.
    // Turn 1: "Study this room" + image → model encodes scene content
    // Turn 2: model confirms AND pre-visualizes the 3/4 geometry
    // Turn 3: generation instruction with geometric constraints
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: "You are a virtual camera operator who re-renders interior scenes from new viewpoints. When given a room photograph and a new camera angle, you produce a new photograph of the SAME room from the requested position. Every piece of furniture, every decoration, every material stays exactly where it is — only the camera moves. You always produce a clear perspective change with vanishing-point convergence." }],
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: "Study this room photograph carefully. Memorize every detail: the exact furniture and where it sits, the wall color and texture, floor material, lighting direction and warmth, and every decorative element. You will need to photograph this exact room from a different camera position." },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "I've carefully memorized every detail of this room — furniture types and exact placement, wall material, floor type, lighting direction, and all decorative objects. I can see this is currently shot from a flat, head-on frontal angle.\n\nWhen I move the camera 45 degrees to one side, I expect to see: the back wall receding at an angle with converging horizontal lines, one side wall becoming visible, the sofa revealing its arm and side profile, and any wall-mounted items appearing foreshortened as trapezoids rather than flat rectangles. I'm ready to generate this 3/4 perspective view." },
          ],
        },
        {
          role: "user",
          parts: [
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        thinkingConfig: {
          thinkingLevel: "high",
          includeThoughts: false,
        },
        imageConfig: {
          aspectRatio,
          imageSize: "4K",
        },
      },
    };

    console.log(
      `[generate-three-quarter] Processing ${productType}, model: ${model}, aspect ratio: ${aspectRatio}, image size: 4K`
    );

    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (attempt ${attempt}):`, errorText);
        if (attempt === MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: `Gemini API error: ${response.status}` },
            { status: response.status }
          );
        }
        continue;
      }

      const result = await response.json();

      const candidates = result.candidates;
      if (!candidates || candidates.length === 0) {
        if (attempt === MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "No response from Gemini API" },
            { status: 500 }
          );
        }
        continue;
      }

      const parts = candidates[0].content?.parts;
      if (!parts || parts.length === 0) {
        if (attempt === MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "No content in Gemini response" },
            { status: 500 }
          );
        }
        continue;
      }

      const imageParts = parts.filter(
        (part: { inlineData?: { mimeType: string; data: string }; thought?: boolean }) =>
          part.inlineData?.mimeType?.startsWith("image/") && !part.thought
      );

      const imagePart = imageParts.length > 0 ? imageParts[imageParts.length - 1] : null;

      if (!imagePart?.inlineData) {
        const textPart = parts.find(
          (part: { text?: string }) => typeof part.text === "string"
        );
        console.error(`Gemini refused/no image (attempt ${attempt}):`, textPart?.text);
        if (attempt === MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "No image generated by Gemini" },
            { status: 500 }
          );
        }
        continue;
      }

      const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      return NextResponse.json({ image: generatedImage });
    }

    return NextResponse.json(
      { error: "Failed to generate 3/4 angle view after multiple attempts" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Generate three-quarter view error:", error);
    return NextResponse.json(
      { error: "Failed to generate 3/4 angle view" },
      { status: 500 }
    );
  }
}
