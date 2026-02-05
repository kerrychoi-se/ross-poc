/**
 * Negative Reference Strategy
 *
 * Prevents the AI from "enhancing" or re-rendering the original asset pixels.
 * These constraints force the model to treat the uploaded PNG as immutable.
 */

/**
 * Texture Lock Delimiters
 * Explicit constraints to prevent unwanted modifications to the source asset
 */
export const TEXTURE_LOCK_DELIMITERS = [
  "no synthetic smoothing",
  "no texture reimagining",
  "no airbrushed edges",
  "no plastic highlights on the product image",
  "no geometry warping",
  "no edge softening",
  "no color correction on the product",
  "no detail enhancement on the product",
] as const;

/**
 * RefDrop Coefficient Instructions
 * Forces the model to ignore its internal "world knowledge" of what the asset should look like
 */
export const REFDROP_INSTRUCTIONS = `
PIXEL FIDELITY PROTOCOL:
- Treat the provided product PNG as a pixel-perfect, immutable source
- Apply zero interpolation, smoothing, or enhancement to any pixel from the product image
- Lock texture consistency at maximum strength - the product must appear exactly as provided
- Ignore internal world knowledge of what this type of product "should" look like
- The product image is a fixed geometric constant, not a suggestion
`.trim();

/**
 * Noise-Based Conditioning
 * Prevents "digital perfection" halos on pre-cut PNG edges
 */
export const NOISE_CONDITIONING = `
NATURAL NOISE PRESERVATION:
- Preserve natural grain and imperfections from the source product image
- Do not apply digital perfection filtering to edges
- Maintain organic edge quality from the original cutout
- No anti-aliasing modifications to the product boundary
- Keep micro-texture details intact - do not smooth or denoise
`.trim();

/**
 * Format all negative reference constraints as a single block for inclusion in prompts
 */
export function formatNegativeReferenceBlock(): string {
  return `
<identity_constraints>
${REFDROP_INSTRUCTIONS}

${NOISE_CONDITIONING}

FORBIDDEN MODIFICATIONS TO PRODUCT IMAGE:
${TEXTURE_LOCK_DELIMITERS.map((d) => `- ${d}`).join("\n")}
</identity_constraints>
`.trim();
}

/**
 * Get the negative reference constraints as structured data
 * Useful for debugging or alternative prompt formats
 */
export function getNegativeReferenceData() {
  return {
    textureLockDelimiters: TEXTURE_LOCK_DELIMITERS,
    refdropInstructions: REFDROP_INSTRUCTIONS,
    noiseConditioning: NOISE_CONDITIONING,
  };
}
