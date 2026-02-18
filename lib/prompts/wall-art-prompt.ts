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
    primary:
      "High-key overexposed natural light flooding the scene, 5600K bright neutral daylight",
    shadows:
      "Near-invisible contact shadows from wall art onto the plaster wall — barely perceptible, never darker than 15% grey",
    temperature: "5600K bright neutral daylight",
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
    livedInDetail: constants.livedInDetail,
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
- Scale Constraint: The wall art is a SMALL decorative accent. It must occupy no more than 10-12% of the total image width. It should look like a modest piece of art, NOT a statement piece that dominates the wall.
- CRITICAL SIZE RULE: Err on the side of TOO SMALL rather than too large. The wall art should feel like a delicate accent, not an oversized statement.
- Real-world Dimensions: Render the wall art at a realistic decorative scale — approximately 40-50cm (16-20 inches) wide and no taller than 60cm (24 inches / 2 feet). These are small decorative pieces, not gallery-scale canvases.
- Proportional Anchoring: The wall art should be approximately 1/5 the width of the sofa — noticeably smaller than the sofa back.
- Vertical Alignment: Position the bottom edge of the wall art approximately 8-12 inches (20-30cm) above eye level, with ample breathing room above the sofa back.
- Negative Space: Maintain generous empty wall space on all sides of the wall art for a relaxed, airy feel — not a tight gallery arrangement. The wall art should look small within the large expanse of wall.
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
PRODUCT FIDELITY IS THE #1 PRIORITY:
- Above all other instructions, the wall art (Asset_1) must appear exactly as provided.
- The product's colors, textures, materials, and proportions are SACRED — do not alter them in any way.
- When in doubt between aesthetic improvement and product accuracy, ALWAYS choose product accuracy.
- Customers will directly compare this image with the actual product they purchase — any deviation erodes trust.

IDENTITY_LOCK PROTOCOL:
The wall art image (Asset_1) is a FIXED GEOMETRIC CONSTANT.
- Do NOT apply style transfer to the wall art
- Do NOT smooth or enhance the wall art texture
- Do NOT modify the wall art's colors, contrast, or saturation
- The AI is the architect for the sofa, rug, and room ONLY
- The wall art must appear exactly as provided in the input

LIGHTING OVERRIDE (CRITICAL):
- The overall image exposure must be high-key: bright, flooded with natural light, almost overexposed.
- No area of the image should appear dark, moody, or underlit.
- Shadows must be barely visible — soft, pale, never darker than a light grey.
- The image should feel like a sun-drenched room at 11am on a bright day with all curtains open.
- Think editorial interior photography for Domino Magazine or Architectural Digest — bright, clean, aspirational.
- Light source: ${lightingDirection}

SHADOW CONSISTENCY PROTOCOL:
- ALL shadows in the scene must follow a single, consistent light source direction matching the lighting above.
- Shadow characteristics: ultra-soft edges, very low opacity (10-20% grey maximum), wide soft penumbra.
- Every object that casts a shadow must cast it in the SAME direction with the SAME softness.
- Contact shadows (where objects meet surfaces) should be barely visible — a subtle darkening, not a hard line.
- No harsh, dark, or high-contrast shadows anywhere in the scene.
- Shadow consistency check: if the light comes from the left, ALL shadows fall to the right. No exceptions.

METALLIC RENDERING (CRITICAL):
- All gold and brass elements must appear warm-toned (18K yellow gold, rich warm brass) — NEVER greenish, olive, or flat.
- Gold surfaces must show dimensional highlights: soft specular reflections, subtle light catch, and visible micro-texture.
- Avoid flat matte gold rendering. Even brushed gold should show directional light reflection and surface variation.
- Gold tone reference: warm amber-gold, like afternoon sunlight on polished brass. NOT cool, NOT green-shifted, NOT flat paint.

ALPHA INTEGRITY:
- If the wall art has transparent regions, the back wall must be visible through them
- Maintain crisp edges where the wall art meets its frame or border
- No artificial glow or halo effects around the wall art edges

SCALE HIERARCHY & DEPTH:
- Scale Hierarchy: Maintain strict furniture proportions — sofa is the anchor, wall art is a small accent.
- Shadow Falloff: Ensure subtle, soft-edged shadows fall opposite the light source direction from the wall art edges to create 3D depth.

PLACEMENT REALISM (CRITICAL):
- Do NOT place any picture frames leaning on the floor, propped against walls, or behind/beside furniture. This looks unrealistic and staged.
- All decorative objects must be in logical, intentional locations (on tables, shelves, or properly hung on walls).
- No objects should appear randomly placed on the floor or in transitional spaces.
- Every item in the scene should look like it belongs there — as if the homeowner placed it with purpose.

LIVED-IN STYLING DIRECTIVE (CRITICAL — read carefully):
This is NOT a showroom, NOT a catalog set, NOT a staging photo for a real estate listing.
This is the actual home of a stylish woman in her 30s-40s who just stepped away for a moment.

WHAT "LIVED-IN" LOOKS LIKE:
- The sofa cushions show gentle body impressions — someone was just sitting there
- A throw blanket is bunched or pulled to one side, not neatly folded or perfectly draped
- At least one pillow has fallen or been pushed to the side, slightly off the sofa or squished flat
- Flowers look 2-3 days old — still beautiful but a few petals have dropped onto the surface below
- A personal item is visible nearby: an open book, reading glasses, a coffee mug, or a cardigan
- Nothing is perfectly centered or symmetrically arranged — asymmetry is key
- Lived-in detail: ${constants.livedInDetail}

WHAT IT IS NOT:
- Not "catalog messy" where one item is 2 degrees off-angle and everything else is perfect
- Not dirty, cluttered, or chaotic — it's beautiful disorder
- Not overly styled with identical spacing between objects
- Think: a behind-the-scenes photo from an Anthropologie or Jenni Kayne catalog shoot, between setups when the stylist stepped away and real life crept in

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided wall art as the immutable focal point.
The scene must be BRIGHT and HIGH-KEY — flooded with natural light, almost overexposed.
The scene must look GENUINELY LIVED-IN — beautiful disorder, not catalog perfection. Shabby chic yet tailored.
Consistent with high-end editorial interior photography — bright, aspirational, but with the unstaged warmth of a real home.
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
