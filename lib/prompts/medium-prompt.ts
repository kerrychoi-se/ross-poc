/**
 * Medium Prompt Builder (~400 words)
 *
 * Shorter variant of the long prompts for A/B test variants A and B.
 * Covers the same topics but more aggressively condensed — fewer
 * per-section details, leaning on the sofa/lighting bank strings
 * to carry descriptive weight.
 *
 * Uses the same randomized scene element banks as the long prompts.
 */

import {
  AESTHETIC_DNA,
  pickRandom,
  SCENE_VARIATIONS,
  getSceneConstants,
  type SceneOptions,
} from "./style-system";

type ProductType = "wall-art" | "shelf";

function buildMediumWallArtPrompt(): {
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
Wide establishing shot — straight-on frontal photograph capturing the full wall and surrounding furniture. Tripod, centered, 90 degrees to back wall. 24mm wide-angle rectilinear lens, f/8, deep focus. All verticals vertical, all horizontals horizontal. Architectural elevation, not a perspective shot. The product must appear SMALL in frame — no more than 5-8% of total image area.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The wall art (Asset_1) is a transparent PNG — reproduce it exactly with zero modification. No style transfer, smoothing, or re-rendering. Generate ONLY the room around it.

SCENE:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}.

Sofa: ${sofa}

Environment: ${wall.description} walls, ${floor.description} flooring, sheer white linen curtains filtering natural light.
Mandatory: ${constants.flowers} | ${constants.goldAccent} | ${constants.wovenTexture}
Coffee table centrally in front of the sofa with lived-in objects — omitting it is a failure condition.

WALL ART PLACEMENT:
Small accent piece on the back wall — no more than 5-8% of total image area. Approximately the size of an 8×10 inch print on a 12-foot wall. Empty wall space at least 6x the art's area. Not oversized or statement-sized. Generous breathing room above sofa. If the art appears larger than a dinner plate relative to the sofa, the image has failed.

LIGHTING:
${lightingDirection}
Soft ambient occlusion and drop-shadows behind the art edges for 3D depth. Gold/brass elements warm-toned with dimensional highlights.

MATERIALS: Wall: ${wall.pbrTexture}. Floor: ${floor.pbrTexture}. Bright lighting reveals micro-texture.

STYLING: Lived-in, not staged. Asymmetric, casual. ${constants.livedInDetail} All storage items in use — no empty vessels.

OUTPUT:
Photorealistic, bright, sun-drenched editorial interior. Wall art is a TINY immutable accent — no more than 5-8% of the image — in a wide, genuinely lived-in room. If the art appears larger than a small picture frame, the camera is too close. Beautiful disorder, not catalog perfection.
`.trim();

  return { prompt, sceneOptions };
}

function buildMediumShelfPrompt(): {
  prompt: string;
  sceneOptions: SceneOptions;
} {
  const wall = pickRandom(SCENE_VARIATIONS.walls);
  const floor = pickRandom(SCENE_VARIATIONS.floors);
  const sofa = pickRandom(SCENE_VARIATIONS.sofas);
  const propSet = pickRandom(SCENE_VARIATIONS.propSets);
  const lightingDirection = pickRandom(SCENE_VARIATIONS.lightingDirections);
  const constants = getSceneConstants();

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
Wide establishing shot — straight-on frontal photograph capturing the full wall and surrounding furniture. Tripod, centered, 90 degrees to back wall. 24mm wide-angle rectilinear lens, deep focus. All verticals vertical, all horizontals horizontal. Architectural elevation, not a perspective shot. The product must appear SMALL in frame — no more than 15-20% of total image width.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The shelf (Asset_1) is a transparent PNG — reproduce it exactly with zero modification. No style transfer, smoothing, or re-rendering. Generate ONLY the room, furniture, and props around it.

SCENE:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}.

Sofa: ${sofa}

Environment: ${wall.description} walls, ${floor.description} flooring, sheer white linen curtains filtering natural light. Back wall visible through any open shelf brackets or gaps.
Mandatory: ${constants.flowers} | ${constants.goldAccent} | ${constants.wovenTexture}
Coffee table centrally in front of the sofa with lived-in objects — omitting it is a failure condition.

SHELF PLACEMENT:
Wall-mounted accent, 15-20% of image width, noticeably smaller than 1/4 sofa width. Bottom positioned 15-20 inches above sofa. At least 3 feet of empty wall space on each side. The shelf must never dominate the wall — it is a minor accent, not a focal point.

PROPS ON SHELF:
${propDescriptions}
Distribute across ALL levels if multi-tier. Every prop visually distinct. Arrange casually, respecting gravity.

LIGHTING:
${lightingDirection}
Ambient occlusion and drop-shadows behind shelf edges for 3D depth. Gold/brass warm-toned with dimensional highlights.

MATERIALS: Wall: ${wall.pbrTexture}. Floor: ${floor.pbrTexture}. Bright lighting reveals micro-texture.

STYLING: Lived-in, not staged. Asymmetric, casual. ${constants.livedInDetail} All storage items in use — no empty vessels.

OUTPUT:
Photorealistic, bright, sun-drenched editorial interior. NOT dark, NOT rustic. Shelf occupies no more than 15-20% of image width — a small immutable accent styled with props across ALL levels, not a dominant feature. Beautiful disorder, not catalog perfection.
`.trim();

  return { prompt, sceneOptions };
}

/**
 * Build a medium (~400 word) prompt for the given product type.
 * Returns the prompt string, its word count, and the scene options used.
 */
export function buildMediumPrompt(productType: ProductType): {
  prompt: string;
  wordCount: number;
  sceneOptions: SceneOptions;
} {
  const { prompt, sceneOptions } =
    productType === "wall-art"
      ? buildMediumWallArtPrompt()
      : buildMediumShelfPrompt();

  const wordCount = prompt.split(/\s+/).length;
  return { prompt, wordCount, sceneOptions };
}
