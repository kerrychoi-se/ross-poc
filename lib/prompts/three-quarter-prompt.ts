/**
 * Three-Quarter Angle Prompt Builder
 *
 * Generates perspective-change prompts to re-render a head-on room photograph
 * from a 3/4 angle. Used in a multi-turn structure where the model first
 * memorizes the room, then receives this prompt as the generation instruction.
 */

/**
 * Build the 3/4 angle prompt for wall art scenes
 */
function buildWallArtThreeQuarterPrompt(): string {
  return `
Now generate a photorealistic photograph of the room you just memorized, but from a COMPLETELY DIFFERENT camera position. The camera has physically moved roughly 45 degrees to one side.

MANDATORY GEOMETRIC CONSTRAINTS — the output image MUST satisfy ALL of these:
1. ONE side wall must be clearly visible, receding into depth at an angle.
2. The back wall must be foreshortened — narrower on the far side, wider on the near side.
3. All horizontal lines (wall-floor junction, ceiling line, shelf edges) MUST converge toward an off-center vanishing point on the left or right.
4. The sofa/seating must show its arm and side profile — not just its front face.
5. The wall art must be foreshortened on the angled wall — a trapezoid shape, NOT a flat rectangle facing the viewer.

If ANY horizontal line runs perfectly parallel to the image frame edge, the perspective has NOT changed enough.

CAMERA SETUP:
Eye-level, 35mm lens, relaxed and elegant framing. No extreme wide-angle distortion, no aggressive corner shots. The feel should be an inviting lifestyle photograph, not a real-estate fisheye.

SCENE FIDELITY:
Use the exact same furniture, wall color, floor material, lighting direction and warmth, and decorative objects you memorized. Do not add, remove, or rearrange anything. The room is frozen — only the camera moved.

WALL ART DETAILS:
The wall art stays small — a delicate accent with generous negative space. From this angle, show its 3D edge thickness (canvas depth or metal returns) on the side nearest the camera. It casts a soft shadow onto the wall surface behind it.
`.trim();
}

/**
 * Build the 3/4 angle prompt for shelf scenes
 */
function buildShelfThreeQuarterPrompt(): string {
  return `
Now generate a photorealistic photograph of the room you just memorized, but from a COMPLETELY DIFFERENT camera position. The camera has physically moved roughly 45 degrees to one side.

MANDATORY GEOMETRIC CONSTRAINTS — the output image MUST satisfy ALL of these:
1. ONE side wall must be clearly visible, receding into depth at an angle.
2. The back wall must be foreshortened — narrower on the far side, wider on the near side.
3. All horizontal lines (wall-floor junction, ceiling line, shelf edges) MUST converge toward an off-center vanishing point on the left or right.
4. The sofa/seating must show its arm and side profile — not just its front face.
5. The shelf must be foreshortened on the angled wall — receding in depth, NOT a flat horizontal line.

If ANY horizontal line runs perfectly parallel to the image frame edge, the perspective has NOT changed enough.

CAMERA SETUP:
Eye-level, 35mm lens, relaxed and elegant framing. No extreme wide-angle distortion, no aggressive corner shots. The feel should be an inviting lifestyle photograph, not a real-estate fisheye.

SCENE FIDELITY:
Use the exact same furniture, wall color, floor material, lighting direction and warmth, and decorative objects you memorized. Do not add, remove, or rearrange anything. The room is frozen — only the camera moved.

SHELF DETAILS:
From this angle, the shelf must show its full physical depth, bracket supports, and side edge on the side nearest the camera. Props on the shelf reveal their 3D form. The shelf casts a soft shadow onto the wall behind it.
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
