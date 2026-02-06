/**
 * Aesthetic DNA Configuration
 *
 * Defines the visual language for the Maison Home Organic Coastal style.
 * These constants inform scene generation across all product types.
 */

export const AESTHETIC_DNA = {
  // Core aesthetic identity
  aesthetic: "Maison Home Organic Coastal",

  // Lighting specification
  lighting: {
    primary: "Soft diffused window light, Left 45-degree angle, 10am morning sun",
    quality: "Soft, diffused through sheer linen",
    temperature: "5500K warm neutral daylight",
    shadows: "Low contrast shadows, soft and gentle, not harsh or dramatic",
  },

  // Color palette
  palette: {
    primary: ["cream", "oatmeal", "warm white"],
    accents: ["light oak", "sage green", "dried olive"],
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
    lens: "35mm environmental",
    aperture: "f/8.0 for deep focus",
    viewpoint: "Eye-level, head-on",
    style: "Clean, balanced, minimalist with intentional negative space",
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
    <neutrals>${AESTHETIC_DNA.palette.neutrals.join(", ")}</neutrals>
  </palette>
  
  <materials>
    <fabrics>${AESTHETIC_DNA.materials.fabrics.join(", ")}</fabrics>
    <woods>${AESTHETIC_DNA.materials.woods.join(", ")}</woods>
    <ceramics>${AESTHETIC_DNA.materials.ceramics.join(", ")}</ceramics>
  </materials>
  
  <composition>
    <lens>${AESTHETIC_DNA.composition.lens}</lens>
    <aperture>${AESTHETIC_DNA.composition.aperture}</aperture>
    <viewpoint>${AESTHETIC_DNA.composition.viewpoint}</viewpoint>
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
   * Wall Bank -- Texture & Architecture
   */
  walls: [
    "Soft 'Swiss Coffee' limewash plaster with subtle movement and matte texture",
    "Classic Parisian-style wainscoting with picture frame molding in a crisp 'All White' finish",
    "Slim-profile vertical micro-shiplap paneling for a modern coastal cottage feel",
    "Creamy dry-stacked travertine or limestone feature wall",
    "Floor-to-ceiling soft white linen curtain backdrop",
    "Walls with a heavy, visible gesso or linen-wrapped canvas texture",
    "Minimalist white walls with curved inset arched niches",
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
    "Very pale weathered grey-toned reclaimed elm planks with a driftwood aesthetic",
  ],

  /**
   * Sofa Bank -- Form & Comfort
   * Each entry is a complete sentence describing placement relative to the shelf.
   */
  sofas: [
    "A low-profile oversized slipcovered linen 'Cloud' sectional in Optic White, positioned directly on the floor beneath the shelf.",
    "A sculptural kidney-bean shaped curved sofa in heavy cream bouclé, placed beneath the shelf.",
    "A high-arm deep-seated tuxedo sofa with square tufting in an oatmeal wool blend, centered below the shelf.",
    "A structured yet soft Belgium track-arm sofa with thin track arms and down-filled cushions, positioned beneath the shelf.",
    "A 'deconstructed' sofa with a light oak frame, exposed linen-wrapped cushions, and leather straps, resting on the floor below the shelf.",
    "A blocky modular piped-linen sectional with prominent seams in Greige, arranged beneath the shelf.",
    "A modern camelback sofa with a slight soft curve to the backrest and cylindrical bolster pillows, placed below the shelf.",
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
            "Three linen-bound books in shades of cream and oatmeal, spines facing inward for a clean look",
          logic: "horizontal_stack_on_shelf_surface",
        },
        {
          description:
            "A tall matte-white cracked ceramic vase with a few wispy, airy olive branches",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A hand-carved bleached Paulownia wood bowl, very light, almost white wood",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Architectural Gallery",
      props: [
        {
          description:
            "A pair of plaster-finish pillar candleholders in varying heights",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A minimalist single-line drawing in a thin bleached oak frame",
          logic: "leaning_on_shelf_surface",
        },
        {
          description: "A fine-weave whitewashed rattan tray or low basket",
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
            "A handmade textured stoneware pitcher holding a single oversized white hydrangea",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A handmade paper journal with a frayed silk ribbon",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Designer",
      props: [
        {
          description:
            "An abstract white plaster knot or loop sculpture",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small aged-terracotta pot with white mineral dusting containing a delicate maidenhair fern",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "Two oversized travel coffee-table books (e.g. Capri or Provence) in pale beige tones",
          logic: "horizontal_stack_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Coastal Curated",
      props: [
        {
          description:
            "A large piece of bleached architectural driftwood, smooth and sculptural",
          logic: "resting_on_shelf_surface",
        },
        {
          description:
            "A fluted clear glass vase with a single large dried fan palm leaf",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small antique brushed brass magnifying glass or small bowl for a touch of warmth",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The High-Key Reflection",
      props: [
        {
          description:
            "A cluster of three ribbed glass bud vases in different heights",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A stack of white books with gold-embossed lettering on the spines",
          logic: "horizontal_stack_on_shelf_surface",
        },
        {
          description: "A small mother-of-pearl inlay dish or coaster",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
    {
      name: "The Soft Textures",
      props: [
        {
          description:
            "A strand of oversized raw blonde wood beads draped over a stack of books",
          logic: "draped_on_shelf_surface",
        },
        {
          description:
            "A ceramic-poured candle in a matte sand-colored jar",
          logic: "standing_on_shelf_surface",
        },
        {
          description:
            "A small low bowl filled with white rose heads, no stems visible",
          logic: "resting_on_shelf_surface",
        },
      ],
    },
  ] as const satisfies readonly PropSet[],
} as const;
