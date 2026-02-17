/**
 * Wall Art Prompt Builder
 *
 * Generates scene generation prompts for wall art products.
 * The uploaded wall art PNG is treated as an immutable anchor, and
 * the AI generates the surrounding lifestyle scene.
 */

import { formatNegativeReferenceBlock } from "./negative-reference";
import { AESTHETIC_DNA, formatAestheticDNA, pickRandom, SCENE_VARIATIONS, getSceneConstants, type SceneOptions } from "./style-system";

/**
 * Scene configuration for wall art scene generation
 */
export const WALL_ART_SCENE = {
  generativeSubject:
    "A luxury modern sofa with deep-seated cushions, upholstered in a high-texture oatmeal woven fabric, placed centrally on a chunky cream wool rug. The sofa has a soft cream throw draped casually over one arm and a few pillows in dusty blue and warm white tossed casually against the cushions.",
  environment: {
    aesthetic: "Maison Home Casual Luxury",
    backWall: "Textured matte white plaster",
    flooring: "Plank-cut light oak",
    elements: "Airy space with visible windows and sheer white linen curtains allowing soft natural light to stream in, natural textures, a warm and inviting casual feel",
  },
  technicalOptics: {
    camera: "35mm environmental lens, f/8.0 for deep focus, rectilinear lens",
    viewpoint:
      "Eye-level, perfectly perpendicular frontal view (orthogonal projection) — camera positioned at exactly 90 degrees to the back wall plane with zero roll, zero pitch, and zero yaw rotation",
    distortionControl:
      "Architecture-aware linear projection to preserve wall art geometry. No keystone distortion, no barrel distortion, rectilinear projection only.",
    geometricConstraints:
      "All vertical lines (door frames, wall edges, furniture legs) must be perfectly vertical in the frame. All horizontal lines (wall art edges, ceiling, baseboards) must be perfectly horizontal. The back wall must appear as a flat plane with zero parallax or perspective convergence.",
    negativeConstraints:
      "CRITICAL: This is NOT a three-quarter view, NOT an angled shot, NOT a perspective view with converging lines. Do NOT rotate the camera on any axis. Do NOT position the camera off-center or at any angle to the wall.",
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
export function buildWallArtPrompt(): { prompt: string; sceneOptions: SceneOptions } {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();

  // Select randomized scene elements from the same banks shelf uses (minus props)
  const wall = pickRandom(SCENE_VARIATIONS.walls);
  const floor = pickRandom(SCENE_VARIATIONS.floors);
  const sofa = pickRandom(SCENE_VARIATIONS.sofas);
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);
  const constants = getSceneConstants();

  const sceneOptions: SceneOptions = {
    lightingDirection,
    wall,
    floor,
    sofa,
    freshFlowers: constants.flowers,
    goldAccent: constants.goldAccent,
    wovenTexture: constants.wovenTexture,
  };

  const prompt = `
CAMERA POSITION (HIGHEST PRIORITY):
This image must be a perfectly straight-on, frontal photograph of a living room wall. The camera is on a tripod at the exact center of the room, aimed directly at the back wall at a perfect 90-degree angle. The wall appears as a flat, symmetrical rectangle in the frame. All vertical lines are perfectly vertical. All horizontal lines are perfectly horizontal. There are no converging perspective lines anywhere in the image. This is an architectural elevation photograph, not a perspective shot.

<system_context>
TASK: Scene Generation Around Fixed Product Asset
ENGINE_MODE: High-Fidelity Scene Generation
MODIFICATION_TARGET: Generate the room, furniture, props, lighting, and environment
PRESERVATION_TARGET: Preserve Asset_1 (wall art) with absolute pixel accuracy — do not redraw or re-render
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${AESTHETIC_DNA.aesthetic}
- The reference images provided demonstrate the target lighting quality and material palette
- Use references to guide atmosphere and texture choices, not to override the scene structure
- IMPORTANT: The scene must feel casual and lived-in, NOT staged or overly styled
</reference_guidance>

<scene_specification>
GENERATIVE SUBJECT:
${sofa}

ENVIRONMENT:
- Back Wall: ${wall}
- Flooring: ${floor}
- Atmosphere: ${WALL_ART_SCENE.environment.elements}
- Windows: Include visible windows or French doors with sheer white linen curtains softly filtering natural light into the room

MANDATORY SCENE ELEMENTS (must appear in every scene):
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}

WALL ART PLACEMENT & SCALE:
- The provided wall art image must be mounted on the back wall
- Scale Constraint: The wall art is a decorative accent; it must occupy no more than 15-20% of the total image width.
- Proportional Anchoring: The wall art should be approximately 1/4 the width of the sofa positioned directly below it.
- Vertical Alignment: Position the bottom edge of the wall art approximately 8-12 inches (20-30cm) above eye level, with ample breathing room above the sofa back.
- Negative Space: Maintain generous empty wall space on all sides of the wall art for a relaxed, airy feel — not a tight gallery arrangement.
- Real-world Dimensions: Render the wall art at a realistic decorative scale (approximately 40-60cm / 16-24 inches wide).
- Render the back wall texture visible through any transparent or alpha regions in the wall art

VISUAL HIERARCHY & COMPOSITION:
- Dominant Subject: The sofa and rug must be the largest and most visually dominant elements in the frame.
- Secondary Subject: The wall art is an accent element; do not allow the camera to "zoom in" or crop tightly on the wall art.
- Camera Angle: Flat frontal photograph, camera centered on the wall and aimed straight ahead, capturing the wall art within the full room context.

TECHNICAL OPTICS:
- Camera: ${WALL_ART_SCENE.technicalOptics.camera}
- Viewpoint: ${WALL_ART_SCENE.technicalOptics.viewpoint}
- Distortion: ${WALL_ART_SCENE.technicalOptics.distortionControl}
- Geometric Constraints: ${WALL_ART_SCENE.technicalOptics.geometricConstraints}
- Angle Constraints: ${WALL_ART_SCENE.technicalOptics.negativeConstraints}
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
- Cast soft, realistic contact shadows from the wall art onto the back wall
- Light source: ${lightingDirection}
- Shadow softness should match ${WALL_ART_SCENE.lighting.temperature} natural daylight
- IMPORTANT: Avoid dark shadows — all shadows must be soft, low-contrast, and gentle

ALPHA INTEGRITY:
- If the wall art has transparent regions, the back wall must be visible through them
- Maintain crisp edges where the wall art meets its frame or border
- No artificial glow or halo effects around the wall art edges

SCALE HIERARCHY & DEPTH:
- Scale Hierarchy: Maintain strict furniture proportions — sofa is the anchor, wall art is the accent.
- Shadow Falloff: Ensure subtle, soft-edged shadows fall opposite the light source direction from the wall art edges to create 3D depth.

CASUAL STYLING DIRECTIVE:
- The scene must look like a real, lived-in home — not a showroom or catalog set
- Elements should appear naturally placed, not meticulously arranged
- Include small imperfections: a throw slightly rumpled, pillows not perfectly symmetrical, flowers casually gathered
- The overall mood is warm, inviting, and effortlessly elegant

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided wall art as the immutable focal point.
The scene should feel warm, casually elegant, and lived-in — like a beautiful home someone actually lives in.
Consistent with high-end interior photography but with a relaxed, unstaged quality.
</fidelity_instructions>
`.trim();

  return { prompt, sceneOptions };
}

/**
 * Get wall art scene configuration for external use
 */
export function getWallArtSceneConfig() {
  return WALL_ART_SCENE;
}
