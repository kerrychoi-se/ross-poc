/**
 * Aesthetic DNA Configuration
 *
 * Defines the visual language for the Maison Home Casual Luxury style.
 * These constants inform scene generation across all product types.
 */

export const AESTHETIC_DNA = {
  // Core aesthetic identity
  aesthetic: "Maison Home Casual Luxury",

  // Lighting specification
  lighting: {
    primary: "Soft diffused natural light, 5500K warm neutral daylight",
    quality: "Soft, diffused through sheer linen",
    temperature: "5500K warm neutral daylight",
    shadows: "Low contrast shadows, soft and gentle, not harsh or dramatic",
  },

  // Color palette
  palette: {
    primary: ["cream", "oatmeal", "warm white"],
    accents: ["light oak", "dusty blue", "soft grey", "muted slate"],
    luxuryTouches: ["brushed gold", "warm brass", "antique gold"],
    neutrals: ["matte white", "soft beige", "natural linen"],
  },

  // Material specifications
  materials: {
    fabrics: [
      "high-texture woven fabric",
      "Belgian linen",
      "bouclé",
      "chunky cream wool",
    ],
    woods: ["light oak", "white oak", "reclaimed wood"],
    ceramics: ["matte white stoneware", "handmade ceramics", "travertine"],
    textiles: ["high-thread-count linen", "sheer curtains", "wool rugs"],
    metallics: ["brushed gold", "warm brass", "antique gold hardware"],
    wovenAccents: [
      "woven seagrass storage basket",
      "striped woven ottoman pouf",
      "woven rattan tray",
      "natural jute accent rug",
    ],
  },

  // Surface specifications per product type
  surfaces: {
    "wall-art": {
      backWall: "Textured matte white plaster",
      description: "Smooth plaster with subtle organic texture",
    },
    shelf: {
      backWall: "Randomized via SCENE_VARIATIONS.walls",
      description: "Selected at prompt-build time from curated bank",
    },
  },

  // Flooring
  flooring: {
    material: "Plank-cut light oak",
    finish: "Matte, natural grain visible",
    width: "Wide planks for modern aesthetic",
  },

  // Camera and composition
  composition: {
    lens: "35mm environmental, rectilinear projection",
    aperture: "f/8.0 for deep focus",
    viewpoint:
      "Eye-level, orthogonal frontal view at 90° to wall plane with zero rotation on any axis",
    cameraParameters:
      "Roll: 0°, Pitch: 0°, Yaw: 0° — no parallax, no perspective distortion, no keystone effect",
    geometricRules:
      "Vertical lines perfectly vertical, horizontal lines perfectly horizontal, flat wall plane rendering",
    style:
      "Relaxed, lived-in elegance with a casual feel — not staged or overly styled",
  },
} as const;

/**
 * Format aesthetic DNA as XML for inclusion in prompts
 */
export function formatAestheticDNA(): string {
  return `<aesthetic_dna>
  <style>${AESTHETIC_DNA.aesthetic}</style>
  
  <lighting>
    <primary>${AESTHETIC_DNA.lighting.primary}</primary>
    <quality>${AESTHETIC_DNA.lighting.quality}</quality>
    <temperature>${AESTHETIC_DNA.lighting.temperature}</temperature>
    <shadows>${AESTHETIC_DNA.lighting.shadows}</shadows>
  </lighting>
  
  <palette>
    <primary>${AESTHETIC_DNA.palette.primary.join(", ")}</primary>
    <accents>${AESTHETIC_DNA.palette.accents.join(", ")}</accents>
    <luxury_touches>${AESTHETIC_DNA.palette.luxuryTouches.join(", ")}</luxury_touches>
    <neutrals>${AESTHETIC_DNA.palette.neutrals.join(", ")}</neutrals>
  </palette>
  
  <materials>
    <fabrics>${AESTHETIC_DNA.materials.fabrics.join(", ")}</fabrics>
    <woods>${AESTHETIC_DNA.materials.woods.join(", ")}</woods>
    <ceramics>${AESTHETIC_DNA.materials.ceramics.join(", ")}</ceramics>
    <metallics>${AESTHETIC_DNA.materials.metallics.join(", ")}</metallics>
    <woven_accents>${AESTHETIC_DNA.materials.wovenAccents.join(", ")}</woven_accents>
  </materials>
  
  <composition>
    <lens>${AESTHETIC_DNA.composition.lens}</lens>
    <aperture>${AESTHETIC_DNA.composition.aperture}</aperture>
    <viewpoint>${AESTHETIC_DNA.composition.viewpoint}</viewpoint>
    <camera_parameters>${AESTHETIC_DNA.composition.cameraParameters}</camera_parameters>
    <geometric_rules>${AESTHETIC_DNA.composition.geometricRules}</geometric_rules>
    <style>${AESTHETIC_DNA.composition.style}</style>
  </composition>
</aesthetic_dna>`;
}

/**
 * Get surface configuration for a specific product type
 */
export function getSurfaceConfig(productType: "wall-art" | "shelf") {
  return AESTHETIC_DNA.surfaces[productType];
}

/**
 * Get lighting configuration
 */
export function getLightingConfig() {
  return AESTHETIC_DNA.lighting;
}

/**
 * Get material palette for scene generation
 */
export function getMaterialPalette() {
  return AESTHETIC_DNA.materials;
}

// ---------------------------------------------------------------------------
// Scene Options — metadata returned alongside the prompt so the UI can
// display which bank selections were used for a given generation.
// ---------------------------------------------------------------------------

export interface SceneOptions {
  lightingDirection: string;
  wall?: string;        // shelf only
  floor?: string;       // shelf only
  sofa?: string;        // shelf only
  propSetName?: string; // shelf only
  freshFlowers: string;
  goldAccent: string;
  wovenTexture: string;
}

// ---------------------------------------------------------------------------
// Scene Variation Banks
// ---------------------------------------------------------------------------

/**
 * Pick a random element from an array
 */
export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * A single prop item for shelf styling
 */
export interface ShelfProp {
  description: string;
  logic: string;
}

/**
 * A coordinated set of props for shelf styling
 */
export interface PropSet {
  name: string;
  props: readonly ShelfProp[];
}

/**
 * Curated banks of on-brand scene elements.
 * Each generation randomly selects one option from each bank,
 * producing varied but aesthetically consistent lifestyle scenes.
 */
export const SCENE_VARIATIONS = {
  /**
   * Lighting Direction Bank -- Varied light sources for natural diversity.
   * Each generation randomly selects one option to avoid repetitive compositions.
   */
  lightingDirections: [
    "Soft diffused window light from camera-left, high-key exposure, 10am morning sun, long soft-edge shadows, bright airy atmosphere.",
    "Warm directional light from camera-left at a 30-degree angle, late afternoon sun, golden-hour glow, high-key with soft amber highlights.",
    "Soft diffused light from camera-right, subtle wrap-around lighting, bright overcast day, minimal shadows, clean white aesthetic.",
    "Soft directional light entering from an unseen side window, gentle light gradients across the floor, bright and airy, 11am clear sky, no dark shadows.",
    "Gentle filtered natural light from camera-left, soft and even with subtle warmth on the walls, diffused morning sun, ethereal and calm, no dark shadows.",
    "Bright overhead diffused daylight, mimic skylight effect, zero harsh shadows, even distribution of light, pristine white-out aesthetic.",
    "Soft frontal diffused natural light from behind the camera, low-contrast, 'beauty light' effect, emphasizing textures and materials without deep shadows.",
  ],

  /**
   * Wall Bank -- Texture & Architecture
   */
  walls: [
    "Soft 'Swiss Coffee' limewash plaster with subtle movement and matte texture",
    "Classic Parisian-style wainscoting with picture frame molding in a crisp 'All White' finish",
    "Slim-profile vertical micro-shiplap paneling for a relaxed, modern cottage feel",
    "Creamy dry-stacked travertine or limestone feature wall",
    "Floor-to-ceiling soft white linen curtain backdrop",
    "Walls with a heavy, visible gesso or linen-wrapped canvas texture",
    "Minimalist white walls with a smooth matte plaster finish",
  ],

  /**
   * Floor Bank -- Foundation & Warmth
   */
  floors: [
    "Wide-plank white oak with matte finish, ultra-light blonde with minimal knots",
    "Bleached oak herringbone parquet in a tight pattern for a European touch",
    "Warm-toned cream-colored polished concrete for an industrial-organic blend",
    "Large chunky-knit natural jute rug covering 80% of the floor space",
    "Large-format honed light travertine tiles with soft blurred grout lines",
    "Tight-knit sisal flooring in a sand-colored hue",
    "Very pale weathered grey-toned reclaimed elm planks with a soft, lived-in patina",
  ],

  /**
   * Sofa Bank -- Form & Comfort
   * Each entry is a complete sentence describing placement relative to the shelf.
   */
  sofas: [
    "A low-profile oversized slipcovered linen 'Cloud' sectional in Optic White, positioned beneath the shelf, with a soft cream throw draped casually over one arm and a few mismatched pillows in dusty blue and oatmeal tossed against the cushions.",
    "A sculptural kidney-bean shaped curved sofa in heavy cream bouclé, placed beneath the shelf, with a lightweight knit blanket folded loosely over the backrest and a couple of soft grey linen pillows.",
    "A high-arm deep-seated tuxedo sofa with square tufting in an oatmeal wool blend, centered below the shelf, with a chunky cream wool throw draped over one side and pillows in muted slate and warm white arranged casually.",
    "A structured yet soft Belgium track-arm sofa with thin track arms and down-filled cushions, positioned beneath the shelf, with a linen throw blanket tossed across the seat and a few soft blue-grey accent pillows.",
    "A 'deconstructed' sofa with a light oak frame, exposed linen-wrapped cushions, and leather straps, resting below the shelf, with a waffle-weave throw folded over one arm and natural linen pillows slightly askew.",
    "A blocky modular piped-linen sectional with prominent seams in Greige, arranged beneath the shelf, with a lightweight cream blanket draped across one cushion and a mix of soft oatmeal and dusty blue throw pillows.",
    "A modern camelback sofa with a slight soft curve to the backrest and cylindrical bolster pillows, placed below the shelf, with a cashmere-blend throw in warm white draped loosely over one arm and a stack of two coffee-table books on one cushion.",
  ],

  /**
   * Prop Set Bank -- Coordinated vignettes of 3 items each.
   * Each set has a thematic name and three props with placement logic.
   */
  propSets: [
    {
      name: "The Organic Minimalist",
      props: [
        {
          description:
            "Three linen-bound books in shades of cream and oatmeal, casually stacked with one slightly offset",
          logic: "horizontal_stack_on_shelf_surface",
        },
        {
          description:
            "A tall matte-white cracked ceramic vase holding a few stems of fresh white roses, loosely arranged as if just picked",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small brushed gold dish or trinket tray with a warm antique patina",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Architectural Gallery",
      props: [
        {
          description:
            "A pair of brushed brass pillar candleholders in varying heights with partially burned cream candles",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A clear glass vase with a few stems of fresh white hydrangeas, petals slightly open and natural",
          logic: "standing_on_shelf_surface",
        },
        {
          description: "A fine-weave woven rattan tray or low basket in a natural warm tone",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Sculptural Tactile",
      props: [
        {
          description:
            "A heavy raw-edge travertine marble slab used as a pedestal",
          logic: "resting_on_shelf_surface",
        },
        {
          description:
            "A handmade textured stoneware pitcher holding a few fresh white peonies, casually arranged",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small antique gold-finish picture frame or decorative object with warm metallic patina",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Designer",
      props: [
        {
          description:
            "A small woven seagrass basket with a natural, handcrafted look",
          logic: "resting_on_shelf_surface",
        },
        {
          description:
            "A fluted glass vase with a small bunch of fresh cream garden roses, loosely gathered",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "Two oversized coffee-table books in pale beige tones, casually stacked with a small brushed gold object resting on top",
          logic: "horizontal_stack_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Golden Hour",
      props: [
        {
          description:
            "A warm brass tray holding a few small objects — a candle in a cream jar and a small ceramic dish",
          logic: "resting_on_shelf_surface",
        },
        {
          description:
            "A clear ribbed glass vase with fresh white and blush ranunculus, arranged loosely and naturally",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A woven rattan storage basket with a rounded shape and natural warm tone",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The High-Key Reflection",
      props: [
        {
          description:
            "A cluster of three ribbed glass bud vases in different heights, each holding a single fresh white flower stem",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A stack of white books with gold-embossed lettering on the spines, placed casually with one slightly angled",
          logic: "horizontal_stack_on_shelf_surface",
        },
        {
          description: "A small brushed gold bowl or dish with a warm antique finish",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Soft Textures",
      props: [
        {
          description:
            "A strand of oversized raw blonde wood beads draped over a stack of cream linen-bound books",
          logic: "draped_on_shelf_surface",
        },
        {
          description:
            "A ceramic-poured candle in a matte sand-colored jar, wick slightly blackened as if recently burned",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small low woven basket filled with fresh white rose heads, loosely arranged",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
  ] as const satisfies readonly PropSet[],
} as const;

// ---------------------------------------------------------------------------
// Scene Constants
// ---------------------------------------------------------------------------

/**
 * Elements that must appear in EVERY scene to match the MAISON HOME brand.
 * These are not randomized — they are always present regardless of which
 * variation bank selections are made.
 */
export const SCENE_CONSTANTS = {
  /**
   * Fresh flowers: The customer explicitly requires fresh flowers in every scene.
   * Randomly select one arrangement per generation.
   */
  freshFlowers: [
    "A clear glass vase with a casual bunch of fresh white roses, loosely arranged as if just gathered from a garden",
    "A stoneware pitcher holding fresh cream and blush peonies, petals slightly open and natural",
    "A simple glass cylinder vase with fresh white hydrangeas, soft and full",
    "A ceramic jug with a few stems of fresh white ranunculus and eucalyptus, casually placed",
    "A small fluted glass vase holding a cluster of fresh white garden roses and greenery",
  ],

  /**
   * Gold/brass accent: At least one gold or brass element must appear per scene
   * to deliver the "touches of luxury" the customer requires.
   * Randomly select one per generation.
   */
  goldAccents: [
    "A small brushed gold tray on a side table or surface nearby",
    "A warm brass side table or accent table with a geometric frame",
    "A gold-finish picture frame leaning casually on a surface",
    "A small antique brass bowl or dish placed on a nearby surface",
    "A gold-rimmed glass or decorative object catching the light softly",
  ],

  /**
   * Woven texture: At least one woven element must appear per scene
   * to deliver the textural richness the customer requires.
   * Randomly select one per generation.
   */
  wovenTextures: [
    "A natural woven seagrass basket placed near the sofa or on the floor",
    "A striped woven ottoman pouf in cream and oatmeal tones beside the sofa",
    "A woven jute or rattan tray on the coffee table or nearby surface",
    "A chunky knit throw blanket in cream casually draped over furniture",
    "A woven wicker storage basket with a rounded shape on the floor nearby",
  ],
} as const;

/**
 * Format scene constants for inclusion in prompts.
 * Randomly selects one option from each constant category.
 */
export function getSceneConstants(): {
  flowers: string;
  goldAccent: string;
  wovenTexture: string;
} {
  return {
    flowers: pickRandom(SCENE_CONSTANTS.freshFlowers),
    goldAccent: pickRandom(SCENE_CONSTANTS.goldAccents),
    wovenTexture: pickRandom(SCENE_CONSTANTS.wovenTextures),
  };
}
