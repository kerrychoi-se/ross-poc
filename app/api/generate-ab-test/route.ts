import { NextRequest, NextResponse } from "next/server";
import { buildWallArtPrompt } from "@/lib/prompts/wall-art-prompt";
import { buildShelfPrompt } from "@/lib/prompts/shelf-prompt";
import { buildMediumPrompt } from "@/lib/prompts/medium-prompt";
import { getReferenceImagePartsForProductType } from "@/lib/references";
import type { SceneOptions } from "@/lib/prompts/style-system";

type ProductType = "wall-art" | "shelf";
type Variant = "A" | "B" | "C" | "D";
type PromptLength = "medium" | "long";

interface VariantConfig {
  promptLength: PromptLength;
  includeReferences: boolean;
  label: string;
}

const MODEL = "gemini-3-pro-image-preview";

const VARIANT_MAP: Record<Variant, VariantConfig> = {
  A: { promptLength: "medium", includeReferences: false, label: "Medium prompt, no refs (Pro)" },
  B: { promptLength: "medium", includeReferences: true,  label: "Medium prompt + refs (Pro)" },
  C: { promptLength: "long",   includeReferences: false, label: "Long prompt, no refs (Pro)" },
  D: { promptLength: "long",   includeReferences: true,  label: "Long prompt + refs (Pro)" },
};

function getPromptForVariant(
  variant: Variant,
  productType: ProductType
): { prompt: string; wordCount: number; sceneOptions: SceneOptions } {
  const config = VARIANT_MAP[variant];

  if (config.promptLength === "medium") {
    return buildMediumPrompt(productType);
  }

  const { prompt, sceneOptions } =
    productType === "wall-art" ? buildWallArtPrompt() : buildShelfPrompt();
  const wordCount = prompt.split(/\s+/).length;
  return { prompt, wordCount, sceneOptions };
}

export async function POST(request: NextRequest) {
  try {
    const { image, productType, variant } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!productType || (productType !== "wall-art" && productType !== "shelf")) {
      return NextResponse.json(
        { error: "Invalid product type. Must be 'wall-art' or 'shelf'" },
        { status: 400 }
      );
    }
    if (!variant || !VARIANT_MAP[variant as Variant]) {
      return NextResponse.json(
        { error: "Invalid variant. Must be 'A', 'B', 'C', or 'D'" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const aspectRatio = process.env.GEMINI_ASPECT_RATIO || "1:1";
    const imageSize = process.env.GEMINI_IMAGE_SIZE || "2K";

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

    const typedVariant = variant as Variant;
    const config = VARIANT_MAP[typedVariant];
    const { prompt, wordCount, sceneOptions } = getPromptForVariant(typedVariant, productType);

    const contentParts: Array<
      | { text: string }
      | { inline_data: { mime_type: string; data: string } }
    > = [
      { text: prompt },
      {
        inline_data: {
          mime_type: mimeType,
          data: base64Image,
        },
      },
    ];

    if (config.includeReferences) {
      const referenceImageParts = await getReferenceImagePartsForProductType(productType);
      if (referenceImageParts.length > 0) {
        contentParts.push({
          text: "\n\nREFERENCE IMAGES (for aesthetic and material guidance only - do not copy directly):",
        });
        contentParts.push(...referenceImageParts);
      }
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const payload: Record<string, unknown> = {
      contents: [{ parts: contentParts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio, imageSize },
      },
    };

    console.log(
      `[generate-ab-test] Variant ${typedVariant} (${config.label}) | ${MODEL} | ${productType} | ${wordCount} words | refs: ${config.includeReferences}`
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-ab-test] Gemini API error for variant ${typedVariant}:`, errorText);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

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

    const imageParts = parts.filter(
      (part: { inlineData?: { mimeType: string; data: string }; thought?: boolean }) =>
        part.inlineData?.mimeType?.startsWith("image/") && !part.thought
    );

    const imagePart = imageParts.length > 0 ? imageParts[imageParts.length - 1] : null;

    if (!imagePart?.inlineData) {
      const textPart = parts.find(
        (part: { text?: string }) => typeof part.text === "string"
      );
      if (textPart?.text) {
        console.error(`[generate-ab-test] Gemini text response for ${typedVariant} (no image):`, textPart.text);
      }
      return NextResponse.json(
        { error: "No image generated by Gemini" },
        { status: 500 }
      );
    }

    const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({
      image: generatedImage,
      variant: typedVariant,
      wordCount,
      label: config.label,
      sceneOptions,
    });
  } catch (error) {
    console.error("[generate-ab-test] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image for A/B test variant" },
      { status: 500 }
    );
  }
}
