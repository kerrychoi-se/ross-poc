/**
 * Shelf Prompt Builder
 *
 * Generates contextual prop generation prompts for shelf products.
 * The uploaded shelf PNG is treated as an immutable resting surface,
 * and the AI generates decorative props that rest naturally on it.
 */

import { formatNegativeReferenceBlock } from "./negative-reference";
import { AESTHETIC_DNA, formatAestheticDNA } from "./style-system";

/**
 * Prop configuration for shelf styling
 */
export const SHELF_PROPS = [
  {
    entity: "linen_bound_books",
    count: 3,
    logic: "horizontal_stack_on_shelf_surface",
    description: "Three linen-bound books in neutral tones, stacked horizontally",
  },
  {
    entity: "matte_white_stoneware_vase",
    fill: "dried olive branches",
    logic: "standing_on_shelf_surface",
    description: "Matte white stoneware vase filled with dried olive branches",
  },
  {
    entity: "reclaimed_wood_bowl",
    size: "small",
    logic: "resting_on_shelf_surface",
    description: "Small reclaimed wood bowl with organic grain",
  },
] as const;

/**
 * Scene configuration for shelf compositing
 */
export const SHELF_SCENE = {
  generativeSubject:
    "A contemporary low-profile sofa in ivory Belgian linen, positioned directly on the floor beneath the shelf.",
  environment: {
    aesthetic: "Maison Home Organic Coastal",
    backWall: "White shiplap wood paneling",
    flooring: "Plank-cut light oak",
  },
  technicalOptics: {
    camera: "35mm focal length, wide environmental framing",
    viewpoint: "Eye-level, head-on shot",
    focus: "Deep focus to capture both shelf detail and room context",
  },
  lighting: {
    primary: "Natural window light from camera-left",
    shadows: "Realistic shadows from props onto shelf surface and wall",
    temperature: "5500K neutral daylight",
  },
} as const;

/**
 * Build the complete shelf compositing prompt
 */
export function buildShelfPrompt(): string {
  const negativeBlock = formatNegativeReferenceBlock();
  const aestheticDNA = formatAestheticDNA();

  const propDescriptions = SHELF_PROPS.map(
    (prop) => `- ${prop.description} (${prop.logic})`
  ).join("\n");

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
- Style: ${SHELF_SCENE.environment.aesthetic}
- The reference images demonstrate target material quality and prop styling
- Use references to guide texture and color palette for generated props
</reference_guidance>

<scene_specification>
GENERATIVE SUBJECT:
${SHELF_SCENE.generativeSubject}

ENVIRONMENT:
- Back Wall: ${SHELF_SCENE.environment.backWall}
- Flooring: ${SHELF_SCENE.environment.flooring}
- The shiplap paneling must be visible through any open brackets, gaps, or transparent regions of the shelf

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
- Camera: ${SHELF_SCENE.technicalOptics.camera}
- Viewpoint: ${SHELF_SCENE.technicalOptics.viewpoint}
- Focus: ${SHELF_SCENE.technicalOptics.focus}
</scene_specification>

<fidelity_instructions>
IDENTITY_LOCK PROTOCOL:
The shelf image (Asset_1) is a FIXED GEOMETRIC CONSTANT.
- Do NOT modify, enhance, or re-render the shelf texture
- Do NOT change the shelf's color, finish, or material appearance
- Do NOT warp or adjust the shelf's geometry
- The AI generates ONLY: sofa, shiplap background, and decorative props
- The shelf pixels must remain exactly as provided

RESTING SURFACE AWARENESS:
- Identify the top plane of the shelf from the provided image
- All generated props must make contact with this surface
- Calculate proper occlusion - props behind other props should be partially hidden
- Props should appear to have weight and physical presence

SHADOW CASTING:
- Cast realistic shadows from generated props onto the shelf surface
- Cast shadows from props onto the shiplap wall behind
- Light source: ${SHELF_SCENE.lighting.primary}
- Shadows should be soft but defined, consistent with ${SHELF_SCENE.lighting.temperature}

ALPHA INTEGRITY:
- The shiplap wall must be visible through all open brackets and gaps in the shelf
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
 * Get shelf scene configuration for external use
 */
export function getShelfSceneConfig() {
  return {
    scene: SHELF_SCENE,
    props: SHELF_PROPS,
  };
}
