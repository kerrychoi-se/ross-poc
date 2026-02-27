/**
 * Medium Prompt Builder (~1000 words)
 *
 * Condensed version of the long prompts for A/B test variants C and D.
 * Covers every topic from the long prompt (camera, fidelity, aesthetic,
 * scene, lighting, lived-in styling) but each section is written more
 * concisely to land around 1000 words total.
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
Perfectly straight-on frontal photograph of a living room wall. Camera on tripod, centered, aimed at the back wall at exactly 90 degrees. All vertical lines perfectly vertical, all horizontal lines perfectly horizontal. No perspective convergence. This is an architectural elevation photograph, not a perspective shot.

TASK: Generate a lifestyle room scene around a fixed product asset (wall art). Generate ONLY the room, furniture, props, lighting, and environment. Preserve Asset_1 (wall art) with absolute pixel accuracy — do not redraw or re-render.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The wall art (Asset_1) is a transparent PNG cutout — a fixed geometric constant, not a suggestion. Reproduce it exactly as provided with zero modification. Do not alter colors, textures, proportions, or edges. Do not apply style transfer, smoothing, enhancement, re-rendering, color correction, or added lighting effects to the product. Preserve natural grain and imperfections from the source image. The product's cutout edges are final — do not re-cut, feather, blur, or modify the edge profile. Where the image has transparent/alpha regions, the generated background must show through naturally.
Customers will directly compare this image with the actual product they purchase — any deviation in color, texture, detail, or proportions erodes trust. This is commercial product representation; treat product fidelity as the single highest priority constraint.

AESTHETIC DIRECTION:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}. Luxury touches in ${AESTHETIC_DNA.palette.luxuryTouches.join(", ")}.
Materials: ${AESTHETIC_DNA.materials.fabrics.join(", ")}, ${AESTHETIC_DNA.materials.woods.join(", ")}, ${AESTHETIC_DNA.materials.ceramics.join(", ")}.
Metallics must be warm-toned: ${AESTHETIC_DNA.materials.metallics[0]}.
The scene must feel casual and lived-in, NOT staged or overly styled.

SCENE:
Sofa: ${sofa}

Environment:
- Back Wall: ${wall}
- Flooring: ${floor}
- Windows with sheer white linen curtains softly filtering natural light into the room

Mandatory Elements:
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}

WALL ART PLACEMENT & SCALE:
- Mounted on the back wall as a SMALL decorative accent — no more than 10–12% of image width. Err on the side of too small.
- Real-world scale: approximately 40–50cm (16–20 inches) wide, no taller than 60cm (24 inches). These are small decorative pieces, not gallery-scale canvases.
- Proportional to sofa: approximately 1/5 the sofa width — noticeably smaller than the sofa back.
- Position bottom edge 8–12 inches (20–30cm) above eye level with generous negative space on all sides.
- Back wall texture visible through any transparent regions.

VISUAL HIERARCHY:
- Dominant: The sofa and rug are the largest, most prominent elements.
- Secondary: The wall art is a small accent — do not zoom in or crop tightly on it.
- Camera: Flat frontal, centered on the wall, full room context visible.

TECHNICAL OPTICS:
- 35mm rectilinear lens, f/8.0 deep focus, eye-level orthogonal projection at 90° to wall plane.
- Zero roll, pitch, yaw. No keystone or barrel distortion. Rectilinear projection only.
- All verticals perfectly vertical, all horizontals perfectly horizontal. Back wall renders as a flat plane.
- NOT a three-quarter view, NOT angled, NOT off-center. Do NOT rotate the camera on any axis.

LIGHTING:
- High-key, bright, flooded with natural light, almost overexposed (+1.5 to +2.0 EV). 5600K neutral daylight.
- No dark, moody, or underlit areas. Sun-drenched room at 11am with all curtains open.
- Light source: ${lightingDirection}
- All shadows follow a single consistent direction: ultra-soft edges, very low opacity (10–20% grey max), wide penumbra. Contact shadows barely visible — a subtle darkening, not a hard line. No harsh or high-contrast shadows anywhere.

METALLIC RENDERING:
All gold and brass elements must appear warm-toned (18K yellow gold, rich warm brass) with dimensional highlights, soft specular reflections, and visible micro-texture. NEVER greenish, olive, or flat matte. Warm amber-gold, like afternoon sunlight on polished brass.

ALPHA INTEGRITY:
If the wall art has transparent regions, show the back wall through them. Maintain crisp edges, no artificial glow or halo effects around the wall art.

PLACEMENT REALISM:
Do NOT place picture frames leaning on the floor or propped against walls. All decorative objects in logical, intentional locations — as if the homeowner placed them with purpose.

LIVED-IN STYLING:
This is the actual home of a stylish woman in her 30s–40s who just stepped away for a moment — NOT a showroom, NOT a catalog set.
- Sofa cushions show gentle body impressions from recent use
- Throw blanket bunched or pulled to one side, not neatly folded
- At least one pillow off-center, fallen to the side, or squished flat
- Flowers a day or two old — still beautiful but a few petals dropped onto the surface below
- A personal item visible nearby: an open book, reading glasses, a coffee mug, or a cardigan
- Nothing perfectly centered or symmetrically arranged — asymmetry is key
- ${constants.livedInDetail}
Not dirty or chaotic — beautiful disorder. Think behind-the-scenes at an Anthropologie or Jenni Kayne shoot, between setups when the stylist stepped away.

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided wall art as the immutable focal point.
The scene must be BRIGHT and HIGH-KEY — flooded with natural light, almost overexposed.
The scene must look GENUINELY LIVED-IN — beautiful disorder, not catalog perfection. Shabby chic yet tailored.
Consistent with high-end editorial interior photography — bright, aspirational, with the unstaged warmth of a real home.
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
Perfectly straight-on frontal photograph of a living room wall. Camera on tripod, centered, aimed at the back wall at exactly 90 degrees. All vertical lines perfectly vertical, all horizontal lines perfectly horizontal. No perspective convergence. This is an architectural elevation photograph, not a perspective shot.

TASK: Generate a lifestyle room scene around a fixed product asset (shelf) with surface-aware object placement. Generate ONLY the room, furniture, decorative props, lighting, and environment. Preserve Asset_1 (shelf) with absolute pixel accuracy — do not redraw or re-render.

PRODUCT FIDELITY (HIGHEST PRIORITY):
The shelf (Asset_1) is a transparent PNG cutout — a fixed geometric constant, not a suggestion. Reproduce it exactly as provided with zero modification. Do not alter colors, textures, finish, material appearance, or geometry. Do not apply style transfer, smoothing, enhancement, re-rendering, color correction, or added lighting effects to the product. Preserve natural grain and imperfections from the source image. The product's cutout edges are final — do not re-cut, feather, blur, or modify the edge profile.
Customers will directly compare this image with the actual product they purchase — any deviation in color, texture, detail, or proportions erodes trust. This is commercial product representation; treat product fidelity as the single highest priority constraint.

AESTHETIC DIRECTION:
Style: ${AESTHETIC_DNA.aesthetic}
Palette: ${AESTHETIC_DNA.palette.primary.join(", ")} with accents of ${AESTHETIC_DNA.palette.accents.join(", ")}. Luxury touches in ${AESTHETIC_DNA.palette.luxuryTouches.join(", ")}.
Materials: ${AESTHETIC_DNA.materials.fabrics.join(", ")}, ${AESTHETIC_DNA.materials.woods.join(", ")}, ${AESTHETIC_DNA.materials.ceramics.join(", ")}.
Metallics must be warm-toned: ${AESTHETIC_DNA.materials.metallics[0]}.
The scene must feel casual and lived-in, NOT staged or overly styled.

SCENE:
Sofa: ${sofa}

Environment:
- Back Wall: ${wall}
- Flooring: ${floor}
- Windows with sheer white linen curtains softly filtering natural light into the room
- The back wall must be visible through any open brackets, gaps, or transparent regions of the shelf

Mandatory Elements:
- Fresh Flowers: ${constants.flowers}
- Gold/Brass Accent: ${constants.goldAccent}
- Woven Texture: ${constants.wovenTexture}

SHELF PLACEMENT & SCALE:
- Wall-mounted accent piece — no more than 25–30% of total image width.
- Proportional to furniture: approximately 1/3 the width of the sofa or sideboard below it.
- Real-world scale: approximately 60–90cm (2–3 feet) wide.
- Position the bottom of the shelf 15–20 inches (40–50cm) above the sofa/sideboard for airy negative space.
- At least 2 feet of empty wall space on left and right sides.

VISUAL HIERARCHY:
- Dominant: The sofa or sideboard is the largest, most prominent element.
- Secondary: The shelf is a delicate accent — do not zoom in or crop tightly on it.
- Camera: Flat frontal, centered on the wall, full room context visible.

PROP ARRANGEMENT ON SHELF:
Generate and place these items on the shelf surface:
${propDescriptions}

Prop Rules:
- If multi-tier shelf, distribute props across ALL levels with varied arrangements per level.
- Every prop must be visually distinct — do not repeat the same item or near-identical items.
- Vary visual density between levels: one sparse, another more curated.
- All props must rest naturally on shelf surfaces — respect gravity, no floating objects.
- Arrange casually, not perfectly symmetrical. Include small touches: a book slightly angled, a candle that looks used.
- Props cast very soft, barely visible shadows onto the shelf surface.

TECHNICAL OPTICS:
- 35mm rectilinear lens, deep focus, eye-level orthogonal projection at 90° to wall plane.
- Zero roll, pitch, yaw. No keystone or barrel distortion.
- All verticals perfectly vertical, all horizontals perfectly horizontal. Back wall renders as a flat plane.
- NOT a three-quarter view, NOT angled, NOT off-center. Do NOT rotate the camera on any axis.

LIGHTING:
- High-key, bright, flooded with natural light, almost overexposed (+1.5 to +2.0 EV). 5600K neutral daylight.
- No dark, moody, or underlit areas — especially important for shelf scenes, avoid any dark or rustic atmosphere.
- Light source: ${lightingDirection}
- All shadows follow a single consistent direction: ultra-soft edges, very low opacity (10–20% grey max), wide penumbra. Contact shadows barely visible. No harsh or high-contrast shadows anywhere.

METALLIC RENDERING:
All gold and brass elements (shelf hardware, prop accents) must appear warm-toned (18K yellow gold, rich warm brass) with dimensional highlights, soft specular reflections, and visible micro-texture. NEVER greenish, olive, or flat matte. Warm amber-gold, like afternoon sunlight on polished brass.

RESTING SURFACE AWARENESS:
Identify the top plane of the shelf (and each level if multi-tier). All generated props must make contact with the appropriate surface. Calculate proper occlusion — props behind others should be partially hidden. Props should appear to have weight and physical presence.

ALPHA INTEGRITY:
Back wall visible through all open brackets and gaps. Crisp edges where shelf meets wall, no artificial glow or halo effects.

PLACEMENT REALISM:
Do NOT place picture frames leaning on the floor or propped against walls. All decorative objects in logical, intentional locations — as if the homeowner placed them with purpose.

LIVED-IN STYLING:
This is the actual home of a stylish woman in her 30s–40s who just stepped away for a moment — NOT a showroom, NOT a catalog set.
- Sofa cushions show gentle body impressions from recent use
- Throw blanket bunched or pulled to one side, not neatly folded
- At least one pillow off-center, fallen to the side, or squished flat
- Flowers a day or two old — still beautiful but a few petals dropped onto the surface below
- A personal item visible nearby: an open book, reading glasses, a coffee mug, or a cardigan
- Asymmetry is key — nothing perfectly centered or symmetrically arranged
- ${constants.livedInDetail}
Not dirty or chaotic — beautiful disorder. Think behind-the-scenes at an Anthropologie or Jenni Kayne shoot.

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided shelf as an immutable element.
Style the shelf with the specified props across ALL shelf levels, creating a warm, casually elegant atmosphere.
The scene must be BRIGHT and HIGH-KEY — flooded with natural light, almost overexposed. NOT dark, NOT rustic.
The scene must look GENUINELY LIVED-IN — beautiful disorder, not catalog perfection. Shabby chic yet tailored.
`.trim();

  return { prompt, sceneOptions };
}

/**
 * Build a medium (~1000 word) prompt for the given product type.
 * Returns the prompt string and its word count.
 */
export function buildMediumPrompt(productType: ProductType): {
  prompt: string;
  wordCount: number;
} {
  const { prompt } =
    productType === "wall-art"
      ? buildMediumWallArtPrompt()
      : buildMediumShelfPrompt();

  const wordCount = prompt.split(/\s+/).length;
  return { prompt, wordCount };
}
