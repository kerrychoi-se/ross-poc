/**
 * Shelf Prompt Builder
 *
 * Generates scene generation prompts for shelf products.
 * The uploaded shelf PNG is treated as an immutable resting surface,
 * and the AI generates decorative props that rest naturally on it.
 *
 * Structured using U-shaped attention pattern: critical constraints
 * (camera, fidelity) at start and end where model attention is highest.
 */

import {
  AESTHETIC_DNA,
  pickRandom,
  SCENE_VARIATIONS,
  getSceneConstants,
  type SceneOptions,
} from "./style-system";

/**
 * Build the complete shelf compositing prompt.
 * Randomly selects wall, floor, sofa, and prop set from curated banks.
 */
export function buildShelfPrompt(): {
  prompt: string;
  sceneOptions: SceneOptions;
} {
  const wall = pickRandom(SCENE_VARIATIONS.walls);
  const floor = pickRandom(SCENE_VARIATIONS.floors);
  const sofa = pickRandom(SCENE_VARIATIONS.sofas);
  const propSet = pickRandom(SCENE_VARIATIONS.propSets);
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);
  const constants = getSceneConstants();

  console.log(`[shelf-prompt] Selected scene elements:`, {
    wall: wall.description,
    floor: floor.description,
    sofa: sofa.slice(0, 60) + "...",
    propSet: propSet.name,
  });

  const sceneOptions: SceneOptions = {
    lightingDirection,
    wall: wall.description,
    floor: floor.description,
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
CAMERA:
Wide establishing shot — perfectly straight-on frontal photograph capturing the full living room wall and all surrounding furniture from edge to edge. Tripod, centered, aimed at the back wall at exactly 90 degrees. 24mm wide-angle rectilinear lens, deep focus. All verticals vertical, all horizontals horizontal. Zero roll/pitch/yaw. Architectural elevation — NOT three-quarter, NOT angled, NOT off-center. The product must appear SMALL in frame — no more than 15-20% of total image width.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The shelf (Asset_1) is a transparent PNG cutout — a fixed pixel-perfect constant. Reproduce it exactly: zero modification to colors, textures, finish, geometry, or edges. No style transfer, smoothing, enhancement, or re-rendering. Generate ONLY the surrounding room, furniture, props, and environment. Customers compare this directly with the physical product.

SCENE:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}. Luxury touches in ${AESTHETIC_DNA.palette.luxuryTouches.join(", ")}.
Materials: ${AESTHETIC_DNA.materials.fabrics.join(", ")}, ${AESTHETIC_DNA.materials.woods.join(", ")}, ${AESTHETIC_DNA.materials.ceramics.join(", ")}. Metallics warm-toned: ${AESTHETIC_DNA.materials.metallics[0]}.

Sofa: ${sofa}

Environment:
- Back Wall: ${wall.description}
- Flooring: ${floor.description}
- Windows with sheer white linen curtains filtering natural light
- Back wall visible through any open brackets, gaps, or transparent regions of the shelf

Mandatory Elements:
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}
- Coffee table centrally in front of the sofa, styled with lived-in objects (books, tray, or small vase). Omitting the coffee table is a failure condition.

SHELF PLACEMENT & SCALE:
Wall-mounted accent piece — no more than 15-20% of total image width, noticeably smaller than 1/4 the width of the sofa below. Real-world scale: approximately 60-90cm wide. Position the bottom 15-20 inches above the sofa for airy negative space. At least 3 feet of empty wall space on each side. CRITICAL: the shelf must never dominate the wall — it is a minor accent, not a focal point.

PROPS ON SHELF:
Generate and place these items on the shelf surface:
${propDescriptions}
If multi-tier, distribute props across ALL levels with varied arrangements per level. Every prop visually distinct — no repeats. All props rest naturally on surfaces respecting gravity. Arrange casually with small touches: a book slightly angled, a candle that looks used. Props cast very soft shadows onto shelf surfaces.

LIGHTING:
${lightingDirection}
5600K neutral daylight, sun-drenched but dimensional. Soft defined shadows reveal form and texture — all shadows follow one consistent direction with soft natural falloff. Contact shadows ground objects. Gold and brass elements must appear warm-toned (18K yellow gold, warm brass) with dimensional highlights — never greenish or flat.
Generate ambient occlusion and soft drop-shadows on the wall behind the shelf edges — brackets and mounting points show contact shadows for 3D depth.

MATERIALS:
- Wall: ${wall.pbrTexture}
- Floor: ${floor.pbrTexture}
Bright lighting reveals surface micro-texture, it does not erase it.

ARCHITECTURAL REALISM:
Standard residential door heights, curtain rods just above window frames, windows with visible architectural details behind sheers. Realistic breathing room between furniture and architectural features.

STYLING:
Casual and genuinely lived-in — not a showroom or catalog set. Asymmetric arrangements, nothing perfectly centered. ${constants.livedInDetail}
All storage items must be actively in use — baskets overflowing with blankets or pillows, shelves filled. No empty vessels, no objects randomly placed on the floor.

OUTPUT:
Photorealistic editorial interior photograph — bright, sun-drenched, dimensional. NOT dark, NOT rustic. The shelf occupies no more than 15-20% of image width — a small immutable accent styled with props across ALL levels, not a dominant feature. Beautiful disorder, shabby chic yet tailored.
`.trim();

  return { prompt, sceneOptions };
}
