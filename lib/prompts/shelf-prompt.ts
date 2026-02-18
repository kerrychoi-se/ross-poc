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
  type SceneOptions,
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
    primary:
      "High-key overexposed natural light flooding the scene, 5600K bright neutral daylight",
    shadows:
      "Near-invisible shadows from props onto shelf surface and wall — barely perceptible, never darker than 15% grey",
    temperature: "5600K bright neutral daylight",
  },
} as const;

/**
 * Build the complete shelf compositing prompt.
 * Randomly selects wall, floor, sofa, and prop set from curated banks.
 */
export function buildShelfPrompt(): { prompt: string; sceneOptions: SceneOptions } {
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

  const sceneOptions: SceneOptions = {
    lightingDirection,
    wall,
    floor,
    sofa,
    propSetName: propSet.name,
    freshFlowers: constants.flowers,
    goldAccent: constants.goldAccent,
    wovenTexture: constants.wovenTexture,
    livedInDetail: constants.livedInDetail,
  };

  const propDescriptions = propSet.props
    .map((prop) => `- ${prop.description} (${prop.logic})`)
    .join("\n");

  const prompt = `
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

PROP DISTRIBUTION RULES:
- If the shelf has multiple levels/tiers, distribute props across ALL visible shelf levels — not just one.
- Each shelf level should have a different arrangement: vary heights, object types, and groupings.
- CRITICAL: Do NOT repeat the same item or near-identical items. Every prop must be visually distinct.
- No two items of the same category (e.g., two vases, two candles, two stacks of books) unless they are clearly different sizes, shapes, or materials.
- Vary the visual density: one level can be sparse (1-2 items), another more curated (2-3 items). Do not make every level look the same.
- Create visual rhythm by alternating tall and short items, organic and geometric shapes.

PROP PHYSICS RULES:
- All props must rest naturally on the shelf's top plane (or on each shelf level)
- Props must respect gravity - no floating objects
- Props should cast very soft, barely visible shadows onto the shelf surface
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
PRODUCT FIDELITY IS THE #1 PRIORITY:
- Above all other instructions, the shelf (Asset_1) must appear exactly as provided.
- The product's colors, textures, materials, and proportions are SACRED — do not alter them in any way.
- When in doubt between aesthetic improvement and product accuracy, ALWAYS choose product accuracy.
- Customers will directly compare this image with the actual product they purchase — any deviation erodes trust.

IDENTITY_LOCK PROTOCOL:
The shelf image (Asset_1) is a FIXED GEOMETRIC CONSTANT.
- Do NOT modify, enhance, or re-render the shelf texture
- Do NOT change the shelf's color, finish, or material appearance
- Do NOT warp or adjust the shelf's geometry
- The AI generates ONLY: sofa, background wall, and decorative props
- The shelf pixels must remain exactly as provided

RESTING SURFACE AWARENESS:
- Identify the top plane of the shelf (and each level if multi-tier) from the provided image
- All generated props must make contact with the appropriate shelf surface
- Calculate proper occlusion - props behind other props should be partially hidden
- Props should appear to have weight and physical presence

LIGHTING OVERRIDE (CRITICAL):
- The overall image exposure must be high-key: bright, flooded with natural light, almost overexposed.
- No area of the image should appear dark, moody, or underlit. This is especially important for shelf scenes — avoid any dark or rustic atmosphere.
- Shadows must be barely visible — soft, pale, never darker than a light grey.
- The image should feel like a sun-drenched room at 11am on a bright day with all curtains open.
- Think editorial interior photography for Domino Magazine or Architectural Digest — bright, clean, aspirational.
- Light source: ${lightingDirection}

SHADOW CONSISTENCY PROTOCOL:
- ALL shadows in the scene must follow a single, consistent light source direction matching the lighting above.
- Shadow characteristics: ultra-soft edges, very low opacity (10-20% grey maximum), wide soft penumbra.
- Every object that casts a shadow must cast it in the SAME direction with the SAME softness.
- Contact shadows (where props meet the shelf surface) should be barely visible — a subtle darkening, not a hard line.
- No harsh, dark, or high-contrast shadows anywhere in the scene.
- Shadow consistency check: if the light comes from the left, ALL shadows fall to the right. No exceptions.

METALLIC RENDERING (CRITICAL):
- All gold and brass elements (shelf hardware, prop accents) must appear warm-toned (18K yellow gold, rich warm brass) — NEVER greenish, olive, or flat.
- Gold surfaces must show dimensional highlights: soft specular reflections, subtle light catch, and visible micro-texture.
- Avoid flat matte gold rendering. Even brushed gold should show directional light reflection and surface variation.
- Gold tone reference: warm amber-gold, like afternoon sunlight on polished brass. NOT cool, NOT green-shifted, NOT flat paint.

ALPHA INTEGRITY:
- The back wall must be visible through all open brackets and gaps in the shelf
- Maintain crisp edges where the shelf meets the wall
- No artificial glow or halo effects around shelf edges

SCALE HIERARCHY & DEPTH:
- Scale Hierarchy: Maintain strict furniture proportions — sofa is the anchor, shelf is the accessory.
- Shadow Falloff: Ensure subtle, soft-edged shadows fall opposite the light source direction from the shelf brackets and props to create 3D depth.

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
Generate a photorealistic lifestyle scene featuring the provided shelf as an immutable element.
The shelf should be styled with the specified props across ALL shelf levels, creating a warm, casually elegant atmosphere.
The scene must be BRIGHT and HIGH-KEY — flooded with natural light, almost overexposed. NOT dark, NOT rustic.
The scene must look GENUINELY LIVED-IN — beautiful disorder, not catalog perfection. Shabby chic yet tailored.
</fidelity_instructions>
`.trim();

  return { prompt, sceneOptions };
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
