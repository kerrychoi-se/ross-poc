/**
 * Shelf Prompt Builder
 *
 * Generates contextual prop generation prompts for shelf products.
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
  pickRandom,
  SCENE_VARIATIONS,
} from "./style-system";

/**
 * Static technical configuration for shelf compositing.
 * These values stay constant across all generations.
 */
const SHELF_TECHNICAL = {
  technicalOptics: {
    camera: "35mm focal length, wide environmental framing",
    viewpoint: "Eye-level, head-on shot",
    focus: "Deep focus to capture both shelf detail and room context",
  },
  lighting: {
    primary: "Soft diffused window light from camera-left, 10am morning sun",
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

  // Log selected elements for debugging / output correlation
  console.log(`[shelf-prompt] Selected scene elements:`, {
    wall,
    floor,
    sofa: sofa.slice(0, 60) + "...",
    propSet: propSet.name,
  });

  const propDescriptions = propSet.props
    .map((prop) => `- ${prop.description} (${prop.logic})`)
    .join("\n");

  return `
<system_context>
TASK: Contextual Prop Generation
ENGINE_MODE: High-Fidelity Scene Generation with Surface-Aware Object Placement
FIDELITY_TARGET: Preserve Asset_1 (shelf) with absolute pixel accuracy
</system_context>

${negativeBlock}

<reference_guidance>
${aestheticDNA}

AESTHETIC DIRECTION:
- Style: ${AESTHETIC_DNA.aesthetic}
- The reference images demonstrate target material quality and prop styling
- Use references to guide texture and color palette for generated props
</reference_guidance>

<scene_specification>
GENERATIVE SUBJECT:
${sofa}

ENVIRONMENT:
- Back Wall: ${wall}
- Flooring: ${floor}
- The back wall must be visible through any open brackets, gaps, or transparent regions of the shelf

SHELF PLACEMENT:
- The provided shelf image is mounted on the wall
- The shelf is the primary surface for prop placement
- Maintain the shelf's exact position, angle, and proportions as provided

PROP ARRANGEMENT ON SHELF SURFACE:
The following decorative items must be generated and placed ON TOP of the shelf:
${propDescriptions}

PROP PHYSICS RULES:
- All props must rest naturally on the shelf's top plane
- Props must respect gravity - no floating objects
- Props should cast realistic shadows onto the shelf surface
- Arrange props with intentional asymmetry for a styled, lived-in look
- Props must not extend beyond shelf edges unless intentionally draped

TECHNICAL OPTICS:
- Camera: ${SHELF_TECHNICAL.technicalOptics.camera}
- Viewpoint: ${SHELF_TECHNICAL.technicalOptics.viewpoint}
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
- Cast realistic shadows from generated props onto the shelf surface
- Cast shadows from props onto the wall behind
- Light source: ${SHELF_TECHNICAL.lighting.primary}
- Shadows should be low contrast, soft but defined, consistent with ${SHELF_TECHNICAL.lighting.temperature}

ALPHA INTEGRITY:
- The back wall must be visible through all open brackets and gaps in the shelf
- Maintain crisp edges where the shelf meets the wall
- No artificial glow or halo effects around shelf edges

OUTPUT:
Generate a photorealistic lifestyle scene featuring the provided shelf as an immutable element.
The shelf should be styled with the specified props, creating an aspirational, curated aesthetic.
The scene should feel authentic to high-end interior photography and home staging.
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
