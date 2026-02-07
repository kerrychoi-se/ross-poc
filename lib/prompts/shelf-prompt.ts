/**
 * Shelf Prompt Builder
 *
 * Generates scene generation prompts for shelf products.
 * The uploaded shelf PNG is treated as an immutable resting surface,
 * and the AI generates decorative props that rest naturally on it.
 *
 * Scene elements (wall, floor, sofa, props) are randomly selected
 * from curated banks to produce varied but on-brand results.
 */

import { formatNegativeReferenceBlock } from "./negative-reference";
import {
  AESTHETIC_DNA,
  formatAestheticDNA,
  getSceneConstants,
  pickRandom,
  SCENE_VARIATIONS,
} from "./style-system";

/**
 * Static technical configuration for shelf compositing.
 * These values stay constant across all generations.
 */
const SHELF_TECHNICAL = {
  technicalOptics: {
    camera: "35mm focal length, wide environmental framing, rectilinear lens",
    viewpoint:
      "Eye-level, perfectly perpendicular frontal view (orthogonal projection) — camera positioned at exactly 90 degrees to the back wall plane with zero roll, zero pitch, and zero yaw rotation",
    geometricConstraints:
      "All vertical lines (door frames, wall edges, furniture legs) must be perfectly vertical in the frame. All horizontal lines (shelves, ceiling, baseboards) must be perfectly horizontal. The back wall must appear as a flat plane with zero parallax or perspective convergence. No keystone distortion, no barrel distortion.",
    negativeConstraints:
      "CRITICAL: This is NOT a three-quarter view, NOT an angled shot, NOT a perspective view with converging lines. Do NOT rotate the camera on any axis. Do NOT position the camera off-center or at any angle to the wall.",
    focus: "Deep focus to capture both shelf detail and room context",
  },
  lighting: {
    primary: "Soft diffused natural light, 5500K warm neutral daylight",
    shadows:
      "Low contrast realistic shadows from props onto shelf surface and wall",
    temperature: "5500K warm neutral daylight",
  },
} as const;

/**
 * Build the complete shelf compositing prompt.
 * Randomly selects wall, floor, sofa, and prop set from curated banks.
 */
export function buildShelfPrompt(): string {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();

  // Select randomized scene elements
  const wall = pickRandom(SCENE_VARIATIONS.walls);
  const floor = pickRandom(SCENE_VARIATIONS.floors);
  const sofa = pickRandom(SCENE_VARIATIONS.sofas);
  const propSet = pickRandom(SCENE_VARIATIONS.propSets);
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);

  // Log selected elements for debugging / output correlation
  console.log(`[shelf-prompt] Selected scene elements:`, {
    wall,
    floor,
    sofa: sofa.slice(0, 60) + "...",
    propSet: propSet.name,
  });

  const constants = getSceneConstants();

  const propDescriptions = propSet.props
    .map((prop) => `- ${prop.description} (${prop.logic})`)
    .join("\n");

  return `
CAMERA POSITION (HIGHEST PRIORITY):
This image must be a perfectly straight-on, frontal photograph of a living room wall. The camera is on a tripod at the exact center of the room, aimed directly at the back wall at a perfect 90-degree angle. The wall appears as a flat, symmetrical rectangle in the frame. All vertical lines are perfectly vertical. All horizontal lines are perfectly horizontal. There are no converging perspective lines anywhere in the image. This is an architectural elevation photograph, not a perspective shot.

<system_context>
TASK: Scene Generation Around Fixed Product Asset
ENGINE_MODE: High-Fidelity Scene Generation with Surface-Aware Object Placement
MODIFICATION_TARGET: Generate the room, furniture, decorative props, lighting, and environment
PRESERVATION_TARGET: Preserve Asset_1 (shelf) with absolute pixel accuracy — do not redraw or re-render
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${AESTHETIC_DNA.aesthetic}
- The reference images demonstrate target material quality and prop styling
- Use references to guide texture and color palette for generated props
- IMPORTANT: The scene must feel casual and lived-in, NOT staged or overly styled
</reference_guidance>

<scene_specification>
GENERATIVE SUBJECT:
${sofa}

ENVIRONMENT:
- Back Wall: ${wall}
- Flooring: ${floor}
- Windows: Include visible windows or French doors with sheer white linen curtains softly filtering natural light into the room
- The back wall must be visible through any open brackets, gaps, or transparent regions of the shelf

MANDATORY SCENE ELEMENTS (must appear in every scene):
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}

SHELF PLACEMENT & SCALE:
- The provided shelf image is mounted on the wall
- Scale Constraint: The shelf is a wall-mounted accent piece; it must occupy no more than 25-30% of the total image width.
- Proportional Anchoring: The shelf should be exactly 1/3 the width of the furniture (sofa or sideboard) positioned directly below it.
- Vertical Alignment: Position the bottom of the shelf approximately 15-20 inches (40-50cm) above the top of the sofa/sideboard to create airy negative space.
- Negative Space: Maintain at least 2 feet of empty wall space on the left and right sides of the shelf for a relaxed, airy feel.
- Real-world Dimensions: Render the shelf at a realistic decorative scale (approximately 60-90cm / 2-3 feet wide).

VISUAL HIERARCHY & COMPOSITION:
- Dominant Subject: The sofa or sideboard must be the largest and most visually dominant piece of furniture in the frame.
- Secondary Subject: The shelf is a delicate secondary element; do not allow the camera to "zoom in" or crop tightly on the shelf.
- Camera Angle: Flat frontal photograph, camera centered on the wall and aimed straight ahead, capturing the shelf within the full room context.

PROP ARRANGEMENT ON SHELF SURFACE:
The following decorative items must be generated and placed ON TOP of the shelf:
${propDescriptions}

PROP PHYSICS RULES:
- All props must rest naturally on the shelf's top plane
- Props must respect gravity - no floating objects
- Props should cast soft, realistic shadows onto the shelf surface
- Arrange props naturally, as if someone casually placed them — not perfectly symmetrical or overly styled
- Props must not extend beyond shelf edges unless intentionally draped
- Include small casual touches: a book slightly angled, a candle that looks used, flowers loosely gathered

TECHNICAL OPTICS:
- Camera: ${SHELF_TECHNICAL.technicalOptics.camera}
- Viewpoint: ${SHELF_TECHNICAL.technicalOptics.viewpoint}
- Geometric Constraints: ${SHELF_TECHNICAL.technicalOptics.geometricConstraints}
- Angle Constraints: ${SHELF_TECHNICAL.technicalOptics.negativeConstraints}
- Focus: ${SHELF_TECHNICAL.technicalOptics.focus}
</scene_specification>

<fidelity_instructions>
IDENTITY_LOCK PROTOCOL:
The shelf image (Asset_1) is a FIXED GEOMETRIC CONSTANT.
- Do NOT modify, enhance, or re-render the shelf texture
- Do NOT change the shelf's color, finish, or material appearance
- Do NOT warp or adjust the shelf's geometry
- The AI generates ONLY: sofa, background wall, and decorative props
- The shelf pixels must remain exactly as provided

RESTING SURFACE AWARENESS:
- Identify the top plane of the shelf from the provided image
- All generated props must make contact with this surface
- Calculate proper occlusion - props behind other props should be partially hidden
- Props should appear to have weight and physical presence

SHADOW CASTING:
- Cast soft, realistic shadows from generated props onto the shelf surface
- Cast shadows from props onto the wall behind
- Light source: ${lightingDirection}
- Shadows should be low contrast, soft but defined, consistent with ${SHELF_TECHNICAL.lighting.temperature}
- IMPORTANT: Avoid dark shadows — all shadows must be soft, low-contrast, and gentle

ALPHA INTEGRITY:
- The back wall must be visible through all open brackets and gaps in the shelf
- Maintain crisp edges where the shelf meets the wall
- No artificial glow or halo effects around shelf edges

SCALE HIERARCHY & DEPTH:
- Scale Hierarchy: Maintain strict furniture proportions — sofa is the anchor, shelf is the accessory.
- Shadow Falloff: Ensure subtle, soft-edged shadows fall opposite the light source direction from the shelf brackets and props to create 3D depth.

CASUAL STYLING DIRECTIVE:
- The scene must look like a real, lived-in home — not a showroom or catalog set
- Elements should appear naturally placed, not meticulously arranged
- Include small imperfections: a throw slightly rumpled, pillows not perfectly symmetrical, flowers casually gathered
- The overall mood is warm, inviting, and effortlessly elegant

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided shelf as an immutable element.
The shelf should be styled with the specified props, creating a warm, casually elegant atmosphere.
The scene should feel like a beautiful home someone actually lives in — relaxed and inviting, not staged.
</fidelity_instructions>
`.trim();
}

/**
 * Get shelf scene configuration for external use.
 * Returns the available variation banks and technical config.
 */
export function getShelfSceneConfig() {
  return {
    variations: SCENE_VARIATIONS,
    technical: SHELF_TECHNICAL,
  };
}
