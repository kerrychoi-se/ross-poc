/**
 * Three-Quarter Angle Prompt Builder
 *
 * Generates lean, perspective-focused prompts to re-render a head-on lifestyle
 * scene from a 3/4 angle. The head-on image is the sole reference — it already
 * encodes the full aesthetic (materials, lighting, palette) so the prompt only
 * needs to describe the camera change and reinforce depth cues.
 */

/**
 * Build the 3/4 angle prompt for wall art scenes
 */
function buildWallArtThreeQuarterPrompt(): string {
  return `
TASK: Re-render the provided reference image from a 3/4 camera angle.

CAMERA:
- Reposition the camera approximately 45 degrees to the side of the original head-on position
- Eye-level height, 35mm lens
- The image must show clear perspective: converging lines on walls and floor, foreshortening on the wall art, visible depth between foreground and background

PRESERVE FROM REFERENCE:
- Same room, same furniture, same wall art, same materials and colors
- Same lighting direction and warmth
- Same casual, lived-in styling (draped throws, tossed pillows, natural arrangements)

DEPTH CUES (important):
- Floor planks or tiles must converge toward a vanishing point
- The side wall should be visible, receding into depth
- The sofa should show its side profile and arm structure
- The wall art should appear foreshortened — narrower on the far side
- Objects closer to the camera should appear larger than those further away
- The room corner or adjacent wall may become visible from this angle

OUTPUT: A photorealistic photograph of the same room, taken from a 3/4 angle. It should feel like a second photograph taken in the same room by moving the camera 45 degrees to the side.
`.trim();
}

/**
 * Build the 3/4 angle prompt for shelf scenes
 */
function buildShelfThreeQuarterPrompt(): string {
  return `
TASK: Re-render the provided reference image from a 3/4 camera angle.

CAMERA:
- Reposition the camera approximately 45 degrees to the side of the original head-on position
- Eye-level height, 35mm lens
- The image must show clear perspective: converging lines on walls and floor, foreshortening on the shelf, visible depth between foreground and background

PRESERVE FROM REFERENCE:
- Same room, same furniture, same shelf, same decorative props, same materials and colors
- Same lighting direction and warmth
- Same casual, lived-in styling (draped throws, tossed pillows, natural arrangements)

DEPTH CUES (important):
- Floor planks or tiles must converge toward a vanishing point
- The side wall should be visible, receding into depth
- The shelf should show its depth, thickness, and side profile
- Props on the shelf should reveal their three-dimensional form from this angle
- The sofa should show its side profile, arm structure, and depth
- Objects closer to the camera should appear larger than those further away
- The room corner or adjacent wall may become visible from this angle

OUTPUT: A photorealistic photograph of the same room, taken from a 3/4 angle. It should feel like a second photograph taken in the same room by moving the camera 45 degrees to the side.
`.trim();
}

/**
 * Build the appropriate 3/4 angle prompt based on product type
 */
export function buildThreeQuarterPrompt(productType: "wall-art" | "shelf"): string {
  switch (productType) {
    case "wall-art":
      return buildWallArtThreeQuarterPrompt();
    case "shelf":
      return buildShelfThreeQuarterPrompt();
    default:
      throw new Error(`Unknown product type: ${productType}`);
  }
}
