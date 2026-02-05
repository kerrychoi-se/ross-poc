import { NextRequest, NextResponse } from "next/server";
import { buildWallArtPrompt } from "@/lib/prompts/wall-art-prompt";
import { buildShelfPrompt } from "@/lib/prompts/shelf-prompt";
import { getReferenceImagePartsForProductType } from "@/lib/references";

type ProductType = "wall-art" | "shelf";

/**
 * Build the appropriate prompt based on product type
 */
function buildPrompt(productType: ProductType): string {
  switch (productType) {
    case "wall-art":
      return buildWallArtPrompt();
    case "shelf":
      return buildShelfPrompt();
    default:
      throw new Error(`Unknown product type: ${productType}`);
  }
}

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

    // Validate product type
    if (productType !== "wall-art" && productType !== "shelf") {
      return NextResponse.json(
        { error: "Invalid product type. Must be 'wall-art' or 'shelf'" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMINI_MODEL || "gemini-3-pro-image-preview";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Extract base64 data from data URL if present
    let base64Image = image;
    let mimeType = "image/png";

    if (image.includes(",")) {
      const parts = image.split(",");
      base64Image = parts[1];
      // Extract mime type from data URL
      const mimeMatch = parts[0].match(/data:([^;]+);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
    }

    // Build the prompt for this product type
    const prompt = buildPrompt(productType);

    // Load reference images for this product type
    const referenceImageParts = await getReferenceImagePartsForProductType(
      productType
    );

    // Build the content parts array
    // Order: prompt text, product image (Asset_1), reference images
    const contentParts: Array<
      | { text: string }
      | { inline_data: { mime_type: string; data: string } }
    > = [
      // Primary instruction prompt
      { text: prompt },
      // Asset_1: The product image (immutable anchor)
      {
        inline_data: {
          mime_type: mimeType,
          data: base64Image,
        },
      },
    ];

    // Add reference images if available (slot_6 aesthetic/prop references)
    if (referenceImageParts.length > 0) {
      // Add a text marker for reference images
      contentParts.push({
        text: "\n\nREFERENCE IMAGES (for aesthetic and material guidance only - do not copy directly):",
      });
      contentParts.push(...referenceImageParts);
    }

    // Call Gemini API
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: contentParts,
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    console.log(
      `[generate-view] Processing ${productType} with ${referenceImageParts.length} reference images`
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Extract the generated image from the response
    const candidates = result.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "No response from Gemini API" },
        { status: 500 }
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      return NextResponse.json(
        { error: "No content in Gemini response" },
        { status: 500 }
      );
    }

    // Find the image part in the response (REST API uses camelCase: inlineData)
    const imagePart = parts.find(
      (part: { inlineData?: { mimeType: string; data: string } }) =>
        part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData) {
      // Check if there's a text response explaining why no image was generated
      const textPart = parts.find(
        (part: { text?: string }) => typeof part.text === "string"
      );
      if (textPart?.text) {
        console.error("Gemini text response (no image):", textPart.text);
      }
      return NextResponse.json(
        { error: "No image generated by Gemini" },
        { status: 500 }
      );
    }

    const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({
      image: generatedImage,
    });
  } catch (error) {
    console.error("Generate view error:", error);
    return NextResponse.json(
      { error: "Failed to generate lifestyle scene" },
      { status: 500 }
    );
  }
}
