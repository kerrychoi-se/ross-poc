/**
 * Short Prompt Builder (~150 words)
 *
 * Minimal prompts for A/B test variants.
 * Critical constraints (camera, product fidelity) placed at start
 * and end to leverage U-shaped attention bias.
 */

type ProductType = "wall-art" | "shelf";

function buildShortWallArtPrompt(): string {
  return `
Generate a photorealistic lifestyle photograph of a bright, airy living room.
Style: Casual luxury, lived-in, sun-drenched but dimensional. Editorial — Domino / Architectural Digest.
Room: Cream/white walls, light oak floors, sheer linen curtains, directional natural light at a 45-degree angle creating soft defined shadows.
Include a linen sofa with tossed pillows and a casually draped throw. Fresh white flowers in a vase, a small gold accent object, and a woven texture element. A coffee table centrally in front of the sofa with lived-in objects (books, tray, or small vase) — omitting it is a failure condition.
The provided wall art is mounted on the back wall — a small accent piece with at least 4x its area in empty wall space around it. Wide room context so the art appears naturally small. Soft shadow on the wall behind the art for depth.
Camera: Straight-on frontal view, 35mm lens, eye-level, no perspective distortion.
Reproduce the wall art exactly as provided — zero modification to colors, textures, or proportions.
`.trim();
}

function buildShortShelfPrompt(): string {
  return `
Generate a photorealistic lifestyle photograph of a bright, airy living room.
Style: Casual luxury, lived-in, sun-drenched but dimensional. Editorial — Domino / Architectural Digest.
Room: Cream/white walls, light oak floors, sheer linen curtains, directional natural light at a 45-degree angle creating soft defined shadows.
Include a linen sofa with tossed pillows and a casually draped throw. Fresh white flowers in a vase, a small gold accent object, and a woven texture element. A coffee table centrally in front of the sofa with lived-in objects (books, tray, or small vase) — omitting it is a failure condition.
The provided shelf is wall-mounted, occupying no more than 25-30% of image width. Add 2-3 props on the shelf: flowers in a vase, a book, a candle — arranged casually. Soft shadows on the wall behind the shelf for depth.
Camera: Straight-on frontal view, 35mm lens, eye-level, no perspective distortion.
Reproduce the shelf exactly as provided — zero modification to colors, textures, or proportions.
`.trim();
}

/**
 * Build a short (~150 word) prompt for the given product type.
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
