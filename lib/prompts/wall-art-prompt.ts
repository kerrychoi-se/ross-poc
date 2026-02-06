/**
 * Wall Art Prompt Builder
 *
 * Generates physics-aware compositing prompts for wall art products.
 * The uploaded wall art PNG is treated as an immutable anchor, and
 * the AI generates the surrounding lifestyle scene.
 */

import { formatNegativeReferenceBlock } from "./negative-reference";
import { AESTHETIC_DNA, formatAestheticDNA, pickRandom, SCENE_VARIATIONS } from "./style-system";

/**
 * Scene configuration for wall art compositing
 */
export const WALL_ART_SCENE = {
  generativeSubject:
    "A luxury modern sofa with deep-seated cushions, upholstered in a high-texture oatmeal woven fabric, placed centrally on a chunky cream wool rug.",
  environment: {
    aesthetic: "Maison Home Organic Coastal",
    backWall: "Textured matte white plaster",
    flooring: "Plank-cut light oak",
    elements: "Airy space, soft-focus linen curtains, natural textures",
  },
  technicalOptics: {
    camera: "35mm environmental lens, f/8.0 for deep focus",
    viewpoint: "Eye-level, head-on environmental shot",
    distortionControl:
      "Architecture-aware linear projection to preserve wall art geometry",
  },
  lighting: {
    primary: "Soft diffused natural light, 5500K warm neutral daylight",
    shadows: "Low contrast soft contact shadows from wall art onto the plaster wall",
    temperature: "5500K warm neutral daylight",
  },
} as const;

/**
 * Build the complete wall art compositing prompt
 */
export function buildWallArtPrompt(): string {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);

  return `
<system_context>
TASK: Physics-Aware Compositing
ENGINE_MODE: High-Fidelity Scene Generation
FIDELITY_TARGET: Preserve Asset_1 (wall art) with absolute pixel accuracy
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${WALL_ART_SCENE.environment.aesthetic}
- The reference images provided demonstrate the target lighting quality and material palette
- Use references to guide atmosphere and texture choices, not to override the scene structure
</reference_guidance>

<scene_specification>
GENERATIVE SUBJECT:
${WALL_ART_SCENE.generativeSubject}

ENVIRONMENT:
- Back Wall: ${WALL_ART_SCENE.environment.backWall}
- Flooring: ${WALL_ART_SCENE.environment.flooring}
- Atmosphere: ${WALL_ART_SCENE.environment.elements}

WALL ART PLACEMENT & SCALE:
- The provided wall art image must be mounted on the back wall
- Scale Constraint: The wall art is a decorative accent; it must occupy no more than 25-30% of the total image width.
- Proportional Anchoring: The wall art should be approximately 1/3 the width of the sofa positioned directly below it.
- Vertical Alignment: Position the bottom edge of the wall art approximately 8-12 inches (20-30cm) above eye level, with ample breathing room above the sofa back.
- Negative Space: Maintain generous empty wall space on all sides of the wall art to preserve a curated, gallery-style look.
- Real-world Dimensions: Render the wall art at a realistic decorative scale (approximately 60-90cm / 2-3 feet wide).
- Render the plaster wall texture visible through any transparent or alpha regions in the wall art

VISUAL HIERARCHY & COMPOSITION:
- Dominant Subject: The sofa and rug must be the largest and most visually dominant elements in the frame.
- Secondary Subject: The wall art is an accent element; do not allow the camera to "zoom in" or crop tightly on the wall art.
- Camera Angle: Use a wide-angle architectural interior perspective to capture the wall art within the context of the full room.

TECHNICAL OPTICS:
- Camera: ${WALL_ART_SCENE.technicalOptics.camera}
- Viewpoint: ${WALL_ART_SCENE.technicalOptics.viewpoint}
- Distortion: ${WALL_ART_SCENE.technicalOptics.distortionControl}
</scene_specification>

<fidelity_instructions>
IDENTITY_LOCK PROTOCOL:
The wall art image (Asset_1) is a FIXED GEOMETRIC CONSTANT.
- Do NOT apply style transfer to the wall art
- Do NOT smooth or enhance the wall art texture
- Do NOT modify the wall art's colors, contrast, or saturation
- The AI is the architect for the sofa, rug, and room ONLY
- The wall art must appear exactly as provided in the input

SHADOW CASTING:
- Cast soft, realistic contact shadows from the wall art onto the plaster wall
- Light source: ${lightingDirection}
- Shadow softness should match ${WALL_ART_SCENE.lighting.temperature} natural daylight

ALPHA INTEGRITY:
- If the wall art has transparent regions, the plaster wall must be visible through them
- Maintain crisp edges where the wall art meets its frame or border
- No artificial glow or halo effects around the wall art edges

SCALE HIERARCHY & DEPTH:
- Scale Hierarchy: Maintain strict furniture proportions — sofa is the anchor, wall art is the accent.
- Shadow Falloff: Ensure subtle, soft-edged shadows fall opposite the light source direction from the wall art edges to create 3D depth.

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided wall art as the immutable focal point.
The scene should feel aspirational, lived-in, and consistent with high-end interior photography.
</fidelity_instructions>
`.trim();
}

/**
 * Get wall art scene configuration for external use
 */
export function getWallArtSceneConfig() {
  return WALL_ART_SCENE;
}
