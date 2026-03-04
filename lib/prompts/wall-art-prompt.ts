/**
 * Wall Art Prompt Builder
 *
 * Generates scene generation prompts for wall art products.
 * The uploaded wall art PNG is treated as an immutable anchor, and
 * the AI generates the surrounding lifestyle scene.
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
 * Build the complete wall art compositing prompt.
 * Randomly selects wall, floor, sofa, and lighting from curated banks.
 */
export function buildWallArtPrompt(): {
  prompt: string;
  sceneOptions: SceneOptions;
} {
  const wall = pickRandom(SCENE_VARIATIONS.walls);
  const floor = pickRandom(SCENE_VARIATIONS.floors);
  const sofa = pickRandom(SCENE_VARIATIONS.sofas);
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);
  const constants = getSceneConstants();

  const sceneOptions: SceneOptions = {
    lightingDirection,
    wall: wall.description,
    floor: floor.description,
    sofa,
    freshFlowers: constants.flowers,
    goldAccent: constants.goldAccent,
    wovenTexture: constants.wovenTexture,
    livedInDetail: constants.livedInDetail,
  };

  const prompt = `
CAMERA:
Wide establishing shot — perfectly straight-on frontal photograph capturing the full living room wall and all surrounding furniture from edge to edge. Tripod, centered, aimed at the back wall at exactly 90 degrees. 24mm wide-angle rectilinear lens, f/8, deep focus. All verticals vertical, all horizontals horizontal. Zero roll/pitch/yaw. Architectural elevation — NOT three-quarter, NOT angled, NOT off-center. The product must appear SMALL in frame — no more than 5-8% of total image area.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The wall art (Asset_1) is a transparent PNG cutout — a fixed pixel-perfect constant. Reproduce it exactly: zero modification to colors, textures, proportions, edges, or grain. No style transfer, smoothing, enhancement, or re-rendering. Where transparent, show the wall through naturally. Generate ONLY the surrounding room and environment. Customers compare this directly with the physical product.

SCENE:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}. Luxury touches in ${AESTHETIC_DNA.palette.luxuryTouches.join(", ")}.
Materials: ${AESTHETIC_DNA.materials.fabrics.join(", ")}, ${AESTHETIC_DNA.materials.woods.join(", ")}, ${AESTHETIC_DNA.materials.ceramics.join(", ")}. Metallics warm-toned: ${AESTHETIC_DNA.materials.metallics[0]}.

Sofa: ${sofa}

Environment:
- Back Wall: ${wall.description}
- Flooring: ${floor.description}
- Windows with sheer white linen curtains filtering natural light

Mandatory Elements:
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}
- Coffee table centrally in front of the sofa, styled with lived-in objects (books, tray, or small vase). Omitting the coffee table is a failure condition.

WALL ART PLACEMENT & SCALE:
Mounted on the back wall as a delicate, small accent piece — no more than 5-8% of total image area. Approximately the size of an 8×10 inch print on a 12-foot-wide wall. The empty wall space around the art must be at least 6x the area of the art itself — force the camera to capture wide room context so the art appears naturally small on the large wall. Do not render as oversized, statement, or gallery-size art. Position with generous breathing room above the sofa back. CRITICAL: if the art appears larger than a dinner plate relative to the sofa, the image has failed.

LIGHTING:
${lightingDirection}
5600K neutral daylight, sun-drenched but dimensional. Soft defined shadows reveal form and texture — all shadows follow one consistent direction with soft natural falloff. Contact shadows ground objects and prevent floating appearance. Gold and brass elements must appear warm-toned (18K yellow gold, warm brass) with dimensional highlights and soft specular reflections — never greenish or flat.
Generate ambient occlusion and soft drop-shadows on the wall behind the art edges — the room's lighting must react to the art's physical presence for 3D depth.

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
Photorealistic editorial interior photograph — bright, sun-drenched, dimensional. The wall art is a TINY immutable accent — no more than 5-8% of the image — within a wide, genuinely lived-in room. If the art appears larger than a small picture frame, the camera is too close. Beautiful disorder, shabby chic yet tailored. Consistent with Domino or Architectural Digest editorial photography.
`.trim();

  return { prompt, sceneOptions };
}
