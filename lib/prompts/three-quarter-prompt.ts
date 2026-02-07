/**
 * Three-Quarter Angle Prompt Builder
 *
 * Generates prompts to re-render a head-on lifestyle scene from a 3/4 angle (ThreeQ view).
 * The generated head-on image is passed as a reference, and the AI re-composes the scene
 * from a 45-degree camera perspective while maintaining high fidelity to all materials,
 * textures, furniture, and spatial arrangement.
 */

import { formatNegativeReferenceBlock } from "./negative-reference";
import { AESTHETIC_DNA, formatAestheticDNA } from "./style-system";
import { WALL_ART_SCENE } from "./wall-art-prompt";

/**
 * Build the 3/4 angle prompt for wall art scenes
 */
function buildWallArtThreeQuarterPrompt(): string {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();

  return `
<system_context>
TASK: 3/4 Angle Re-Composition
ENGINE_MODE: High-Fidelity Perspective Shift
FIDELITY_TARGET: Maintain identical scene elements from the provided reference image
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${WALL_ART_SCENE.environment.aesthetic}
- The provided reference image IS the authoritative scene — replicate every element faithfully
- Match the exact lighting quality, material palette, and spatial arrangement from the reference
- Maintain the casual, lived-in quality — do not make the scene look more staged from this angle
</reference_guidance>

<scene_specification>
PERSPECTIVE SHIFT INSTRUCTION:
Re-render the provided reference image from a 3/4 angle (ThreeQ view).
The camera is repositioned at a 45-degree perspective to show the side profile and depth of the room.

WHAT MUST BE PRESERVED FROM THE REFERENCE IMAGE:
- The wall art: identical design, colors, frame, and mounting position on the wall
- The sofa: identical fabric texture, cushion shape, proportions, and casual styling (draped throws, tossed pillows)
- The rug: identical chunky cream wool texture and placement
- The back wall: ${WALL_ART_SCENE.environment.backWall} with same texture
- The flooring: ${WALL_ART_SCENE.environment.flooring} with same grain pattern
- All decorative elements visible in the reference (fresh flowers, gold accents, woven textures)
- Windows with sheer curtains if visible in the reference

CAMERA SPECIFICATION:
- Angle: 3/4 perspective (approximately 45 degrees from the head-on position)
- The camera reveals the side wall, sofa depth/profile, and spatial depth of the room
- Height: Eye-level, consistent with the reference
- Lens: 35mm environmental, f/8.0 for deep focus
- The wall art should appear in natural perspective foreshortening from this angle

LIGHTING:
- Primary: Match the lighting direction visible in the provided reference image exactly
- Temperature: ${WALL_ART_SCENE.lighting.temperature}
- Shadows: Adjusted for the new camera angle but maintaining same quality, direction, and softness as the reference
- IMPORTANT: Keep shadows soft and low-contrast — avoid dark shadows
</scene_specification>

<fidelity_instructions>
HIGH-FIDELITY DETAIL PRESERVATION:
The provided reference image contains the EXACT scene to be re-rendered from a new angle.
- Maintain identical materials: wood grain on floors, fabric textures on sofa, wall plaster texture
- Maintain identical colors: do not shift the color palette, white balance, or saturation
- Maintain identical object identity: same furniture pieces, same wall art, same proportions
- Maintain the casual styling: throws should still look casually draped, pillows naturally placed
- The only change is the camera angle — everything else must remain consistent

SPATIAL REASONING:
- The 3/4 angle should reveal depth that was hidden in the head-on view
- Show the side profile of the sofa, revealing its depth and arm structure
- The wall art should show natural perspective — slightly narrower on the far side
- The room corner or adjacent wall may become visible from this angle
- Floor planks should show proper perspective convergence

OUTPUT:
Generate a photorealistic lifestyle scene that is clearly the SAME room and SAME furniture
as the reference image, but photographed from a 3/4 angle. The result should feel like
a second photograph taken in the same room by moving the camera 45 degrees to the side.
Maintain the warm, casually elegant, lived-in quality of the original scene.
</fidelity_instructions>
`.trim();
}

/**
 * Build the 3/4 angle prompt for shelf scenes
 */
function buildShelfThreeQuarterPrompt(): string {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();

  return `
<system_context>
TASK: 3/4 Angle Re-Composition
ENGINE_MODE: High-Fidelity Perspective Shift
FIDELITY_TARGET: Maintain identical scene elements from the provided reference image
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${AESTHETIC_DNA.aesthetic}
- The provided reference image IS the authoritative scene — replicate every element faithfully
- Match the exact lighting quality, material palette, and spatial arrangement from the reference
- Maintain the casual, lived-in quality — do not make the scene look more staged from this angle
</reference_guidance>

<scene_specification>
PERSPECTIVE SHIFT INSTRUCTION:
Re-render the provided reference image from a 3/4 angle (ThreeQ view).
The camera is repositioned at a 45-degree perspective to show the side profile and depth of the scene.

WHAT MUST BE PRESERVED FROM THE REFERENCE IMAGE:
- The shelf: identical wood finish, mounting, proportions, and wall position
- All decorative props on the shelf: identical objects, materials, and casual arrangement
- The sofa: identical fabric, shape, placement, and casual styling (draped throws, tossed pillows)
- The back wall: identical texture, color, and material as shown in the reference
- The flooring: identical material and grain pattern as shown in the reference
- All styling details visible in the reference (fresh flowers, gold accents, woven textures)
- Windows with sheer curtains if visible in the reference

CAMERA SPECIFICATION:
- Angle: 3/4 perspective (approximately 45 degrees from the head-on position)
- The camera reveals the shelf depth/profile, prop arrangement from the side, and spatial depth
- Height: Eye-level, consistent with the reference
- Lens: 35mm environmental, wide framing with deep focus
- The shelf should appear in natural perspective foreshortening from this angle

LIGHTING:
- Primary: Match the lighting direction visible in the provided reference image exactly
- Temperature: ${AESTHETIC_DNA.lighting.temperature}
- Shadows: Adjusted for the new camera angle but maintaining same quality, direction, and softness as the reference
- IMPORTANT: Keep shadows soft and low-contrast — avoid dark shadows
</scene_specification>

<fidelity_instructions>
HIGH-FIDELITY DETAIL PRESERVATION:
The provided reference image contains the EXACT scene to be re-rendered from a new angle.
- Maintain identical materials: shelf wood grain, wall texture, fabric textures
- Maintain identical colors: do not shift the color palette, white balance, or saturation
- Maintain identical object identity: same shelf, same props, same sofa, same proportions
- Maintain the casual styling: throws should still look casually draped, pillows naturally placed
- The only change is the camera angle — everything else must remain consistent

SPATIAL REASONING:
- The 3/4 angle should reveal depth that was hidden in the head-on view
- Show the shelf's depth and side profile, revealing its thickness and mounting brackets
- Props on the shelf should show their three-dimensional form from this angle
- The sofa should reveal its side profile, arm structure, and depth
- The back wall should show proper perspective with converging lines
- Floor planks should show proper perspective convergence

OUTPUT:
Generate a photorealistic lifestyle scene that is clearly the SAME room and SAME furniture
as the reference image, but photographed from a 3/4 angle. The result should feel like
a second photograph taken in the same room by moving the camera 45 degrees to the side.
Maintain the warm, casually elegant, lived-in quality of the original scene.
</fidelity_instructions>
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
