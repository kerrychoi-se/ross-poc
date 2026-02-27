/**
 * Short Prompt Builder (~85 words)
 *
 * Minimal prompts for the A/B test variants A1 and A2.
 * Per Gemini-specific research, the most critical constraints
 * (camera angle, product fidelity) are placed LAST so they act
 * as the final "anchor" the model reads before generating.
 */

type ProductType = "wall-art" | "shelf";

function buildShortWallArtPrompt(): string {
  return `
Generate a photorealistic lifestyle photograph of a bright, airy living room.
Style: Casual luxury, lived-in, bright and high-key. Editorial — Domino / Architectural Digest.
Room: Cream/white walls, light oak floors, sheer linen curtains, natural light flooding in.
Include a linen sofa with tossed pillows and a casually draped throw. Add fresh white flowers in a vase, a small gold accent object, and a woven texture element.
The provided wall art is mounted on the back wall, small — approximately 10% of image width.
Camera: Perfectly straight-on frontal view, 35mm lens, eye-level, no perspective distortion.
Reproduce the wall art exactly as provided. Do not alter its colors, textures, or proportions.
`.trim();
}

function buildShortShelfPrompt(): string {
  return `
Generate a photorealistic lifestyle photograph of a bright, airy living room.
Style: Casual luxury, lived-in, bright and high-key. Editorial — Domino / Architectural Digest.
Room: Cream/white walls, light oak floors, sheer linen curtains, natural light flooding in.
Include a linen sofa with tossed pillows and a casually draped throw. Add fresh white flowers in a vase, a small gold accent object, and a woven texture element.
The provided shelf is wall-mounted, occupying no more than 25–30% of image width.
Add 2–3 props on the shelf: white flowers in a vase, a book, a candle. Arrange them casually.
Camera: Perfectly straight-on frontal view, 35mm lens, eye-level, no perspective distortion.
Reproduce the shelf exactly as provided. Do not alter its colors, textures, or proportions.
`.trim();
}

/**
 * Build a short (~85 word) prompt for the given product type.
 * Returns the prompt string and its word count.
 */
export function buildShortPrompt(productType: ProductType): {
  prompt: string;
  wordCount: number;
} {
  const prompt =
    productType === "wall-art"
      ? buildShortWallArtPrompt()
      : buildShortShelfPrompt();

  const wordCount = prompt.split(/\s+/).length;
  return { prompt, wordCount };
}
