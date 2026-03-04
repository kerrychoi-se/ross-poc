/**
 * Negative Reference Strategy
 *
 * Compact product fidelity constraint block. The verbose version was removed
 * because research shows that repeating "don't modify the product" 15 different
 * ways causes semantic overload in image generation models.
 *
 * Product fidelity instructions are now inlined directly in each prompt builder
 * as a single concise paragraph (~50 words). This file is retained as an
 * optional utility if a standalone fidelity block is ever needed.
 */

/**
 * Returns a compact product fidelity constraint string (~50 words).
 * Use this when you need a standalone fidelity block outside of the
 * main prompt builders.
 */
export function getProductFidelityBlock(
  assetName: string = "Asset_1"
): string {
  return `PRODUCT FIDELITY (HIGHEST PRIORITY):
${assetName} is a transparent PNG cutout — a fixed pixel-perfect constant. Reproduce it exactly: zero modification to colors, textures, proportions, edges, or grain. No style transfer, smoothing, enhancement, or re-rendering. Where transparent, show background through naturally. Generate ONLY the surrounding environment. Customers compare this directly with the physical product.`;
}
