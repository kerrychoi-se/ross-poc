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
  "no re-interpretation of the product from a different angle",
  "no added lighting effects (glare, specular highlights, reflections) not present in the original",
  "no blending or feathering of product edges into the background",
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
 * Generation Boundary
 * Explicitly delineates what the model should and should not generate,
 * making clear the product is a finished asset not to be redrawn.
 */
export const GENERATION_BOUNDARY = `
GENERATION BOUNDARY:
- MODIFICATION_TARGET: Generate ONLY the surrounding environment (walls, floor, furniture, props, lighting, shadows)
- PRESERVATION_TARGET: The product image (Asset_1) is the FINAL, completed asset
- Do NOT redraw, re-render, re-interpret, or generate a new version of this product
- Do NOT infer what the product "should" look like — reproduce it exactly as provided
- The product in the output must be indistinguishable from the product in the input
`.trim();

/**
 * Input Asset Description
 * Tells the model exactly what kind of image it is receiving so it can
 * handle the transparent PNG cutout appropriately.
 */
export const INPUT_ASSET_DESCRIPTION = `
INPUT ASSET DESCRIPTION:
- The provided image (Asset_1) is a transparent PNG with the background already removed
- This is a pre-processed product photograph, not a rendering, illustration, or concept
- The cutout edges are final — do not re-cut, feather, blur, or modify the edge profile
- Where the image has transparent/alpha regions, the generated background must show through naturally
- The product's exact photographic qualities (lighting, grain, texture, color) are intentional and must be preserved
`.trim();

/**
 * Format all negative reference constraints as a single block for inclusion in prompts
 */
export function formatNegativeReferenceBlock(): string {
  return `
<identity_constraints>
${INPUT_ASSET_DESCRIPTION}

${GENERATION_BOUNDARY}

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
    generationBoundary: GENERATION_BOUNDARY,
    inputAssetDescription: INPUT_ASSET_DESCRIPTION,
  };
}
