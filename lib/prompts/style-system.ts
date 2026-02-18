/**
 * Aesthetic DNA Configuration
 *
 * Defines the visual language for the Maison Home Casual Luxury style.
 * These constants inform scene generation across all product types.
 */

export const AESTHETIC_DNA = {
  // Core aesthetic identity
  aesthetic:
    "Maison Home Casual Luxury — aspirational yet lived-in, shabby chic yet tailored. For a modern working woman with taste and disposable income. Think bright Parisian apartment meets California light.",

  // Lighting specification — HIGH-KEY FLOODED LOOK
  lighting: {
    primary:
      "High-key overexposed natural light flooding the entire scene, 5600K bright neutral daylight — the room should feel drenched in light",
    quality:
      "Extremely bright and airy, diffused through sheer white linen, every surface washed in soft white light with almost no dark areas",
    temperature: "5600K bright neutral daylight with slight warm bias",
    shadows:
      "Near-invisible shadows — extremely low contrast, barely perceptible, never darker than 15% grey. No dark shadows anywhere in the scene.",
    exposure:
      "+1.5 to +2.0 EV overexposure — whites should bloom slightly, mid-tones pushed bright, no muddy or dark areas anywhere",
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
    woods: ["light oak", "white oak", "bleached white oak"],
    ceramics: ["matte white stoneware", "handmade ceramics", "travertine"],
    textiles: ["high-thread-count linen", "sheer curtains", "wool rugs"],
    metallics: [
      "warm 18K brushed gold with visible micro-highlights and soft reflections — NOT flat, NOT greenish",
      "rich warm brass with subtle patina and specular highlights catching the light",
      "antique gold hardware with warm amber undertones and dimensional light-play",
    ],
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
      "Aspirational but approachable — a beautiful home that feels real and lived-in. Shabby chic elegance with tailored details. Not a showroom, not rustic farmhouse. The home of a stylish woman who entertains effortlessly.",
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
    <exposure>${AESTHETIC_DNA.lighting.exposure}</exposure>
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
  livedInDetail: string;
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
    "Flooded high-key window light from camera-left, overexposed +1.5 EV, 10am bright morning sun, near-invisible pale shadows, entire room drenched in white light.",
    "Bright overexposed natural light from camera-left at a 30-degree angle, midday sun flooding through large windows, high-key with luminous warm-white highlights, shadows barely perceptible.",
    "Flooded diffused light from camera-right, wrap-around brightness filling every corner, bright clear day, near-zero shadows, pristine white airy aesthetic.",
    "Brilliant natural light pouring from an unseen side window, light gradients washed bright across all surfaces, 11am clear sky, flooded high-key exposure, no dark areas anywhere.",
    "Bright even natural light from camera-left flooding the room, every surface bathed in soft white luminosity, diffused morning sun, ethereal bright atmosphere, shadows barely a whisper.",
    "Intense overhead diffused daylight flooding from skylights, overexposed high-key, zero shadows, perfectly even white light distribution, pristine sun-drenched aesthetic.",
    "Bright frontal diffused natural light from behind the camera, flooded flat lighting, high-key overexposure, emphasizing textures and materials in brilliant white light, no shadows deeper than 10% grey.",
  ],

  /**
   * Wall Bank -- Texture & Architecture
   */
  walls: [
    "Soft 'Swiss Coffee' limewash plaster with subtle movement and matte texture, bright and luminous",
    "Classic Parisian-style wainscoting with picture frame molding in a crisp 'All White' finish, catching the light beautifully",
    "Slim-profile vertical micro-shiplap paneling in bright white for a relaxed, modern cottage feel",
    "Bright limewash Roman clay in warm white with soft tonal variation, sun-washed and luminous",
    "Clean gallery-white walls with subtle hand-troweled plaster texture, reflecting abundant natural light",
    "Minimalist white walls with a smooth matte plaster finish, bright and airy",
  ],

  /**
   * Floor Bank -- Foundation & Warmth
   */
  floors: [
    "Wide-plank white oak with matte finish, ultra-light blonde with minimal knots, bright and clean",
    "Bleached oak herringbone parquet in a tight pattern for a bright European touch",
    "Pale cream limestone tiles with barely visible veining, luminous and light-reflecting",
    "Large chunky-knit natural jute rug in a light sand tone covering 80% of the floor space",
    "Large-format honed light travertine tiles with soft blurred grout lines, sun-washed appearance",
    "Ultra-light whitewashed wide-plank oak with a soft matte sheen, bright Scandinavian feel",
    "Tight-knit sisal flooring in a pale sand-colored hue, light and natural",
  ],

  /**
   * Sofa Bank -- Form & Comfort
   * Each entry is a complete sentence describing placement relative to the shelf.
   */
  sofas: [
    "A low-profile oversized slipcovered linen 'Cloud' sectional in Optic White, positioned beneath the shelf. The seat cushions show soft body impressions where someone was just sitting. A cream throw is bunched up in one corner rather than neatly draped. Mismatched pillows in dusty blue and oatmeal are squished against the arm — one has slipped halfway off onto the cushion edge.",
    "A sculptural kidney-bean shaped curved sofa in heavy cream bouclé, placed beneath the shelf. A lightweight knit blanket has been pulled to one side and is half-sliding off the seat. A couple of soft grey linen pillows are stacked unevenly, one dented from being leaned against. The cushions show a gentle impression of recent use.",
    "A high-arm deep-seated tuxedo sofa with square tufting in an oatmeal wool blend, centered below the shelf. A chunky cream wool throw is bunched into a nest in one corner as if someone was curled up reading. Pillows in muted slate and warm white are pushed to the sides — one has fallen against the arm at an angle, another is slightly squished flat.",
    "A structured yet soft Belgium track-arm sofa with thin track arms and down-filled cushions, positioned beneath the shelf. A linen throw blanket is tangled loosely across the seat, trailing over one arm. A few soft blue-grey accent pillows are scattered unevenly — one propped upright, one lying flat, one pushed into the corner. The down cushions show soft sitting impressions.",
    "A 'deconstructed' sofa with a light oak frame, exposed linen-wrapped cushions, and leather straps, resting below the shelf. A waffle-weave throw is half-pulled off the arm, one end pooling slightly. Natural linen pillows are askew — one flopped on its side, another wedged into the corner. The seat cushion fabric is gently rumpled from use.",
    "A blocky modular piped-linen sectional with prominent seams in Greige, arranged beneath the shelf. A lightweight cream blanket is bunched and twisted across one cushion as if someone pushed it aside when standing up. Soft oatmeal and dusty blue throw pillows are scattered in a loose cluster — not lined up, not evenly spaced. One pillow sits on the floor beside the sofa where it tumbled.",
    "A modern camelback sofa with a slight soft curve to the backrest and cylindrical bolster pillows, placed below the shelf. A cashmere-blend throw in warm white is bunched up against one arm, half-draped and half-fallen. A couple of pillows are stacked unevenly against the opposite arm, and a coffee-table book lies open face-down on the middle cushion. The seat shows soft impressions from someone who was just sitting there.",
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

  /**
   * Lived-In Details Bank -- Signs of real human activity.
   * Each generation randomly selects one vignette to inject into the scene,
   * adding aspirational but authentic "someone lives here" texture.
   */
  livedInDetails: [
    "An open hardcover book lying face-down on the sofa cushion mid-read, with a pair of tortoiseshell reading glasses resting on the sofa arm nearby.",
    "A handmade ceramic mug of half-finished coffee sitting on a side table, with a faint ring stain forming underneath it on a small linen coaster.",
    "A lightweight cashmere cardigan in soft oatmeal draped over the sofa arm as if just shrugged off, one sleeve trailing down.",
    "A pair of leather ballet flats kicked off near the base of the sofa, slightly askew and pointing in different directions — someone just got comfortable.",
    "An open linen-covered notebook or journal with a brass pen resting across it, left on the sofa cushion as if mid-thought.",
    "A small stack of glossy magazines fanned out on a side table, the top one open to a dog-eared page, a reading glasses case beside them.",
    "A knit throw blanket pulled halfway off the sofa and pooling gently on the floor, as if someone just stood up and walked away.",
  ],
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
    "A clear glass vase with a loose bunch of white roses — still beautiful but a day or two old, a few petals have dropped onto the surface below, one stem leaning out of the arrangement",
    "A stoneware pitcher holding cream and blush peonies, petals fully open and beginning to soften, a couple of fallen petals scattered on the table around the base",
    "A simple glass cylinder vase with white hydrangeas, soft and full but slightly past peak — one or two florets browning at the edges, a natural imperfection",
    "A ceramic jug with a few stems of white ranunculus and eucalyptus, casually placed and slightly drooping — the water level is low, a fallen leaf rests on the surface nearby",
    "A small fluted glass vase holding a cluster of white garden roses and greenery — petals softly opening, a couple beginning to curl at the edges, one petal on the table",
  ],

  /**
   * Gold/brass accent: At least one gold or brass element must appear per scene
   * to deliver the "touches of luxury" the customer requires.
   * Randomly select one per generation.
   */
  goldAccents: [
    "A small warm 18K brushed gold tray on a side table, with visible highlights and soft reflections",
    "A warm brass side table or accent table with a geometric frame, catching natural light with dimensional reflections",
    "A small brushed gold decorative sculpture or object on a side table, with warm amber tone and specular highlights",
    "A small antique brass bowl or dish with warm patina placed on a nearby surface, light glinting softly off the rim",
    "A gold-rimmed glass or decorative object with rich warm tone catching the light, showing depth and dimension",
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
  livedInDetail: string;
} {
  return {
    flowers: pickRandom(SCENE_CONSTANTS.freshFlowers),
    goldAccent: pickRandom(SCENE_CONSTANTS.goldAccents),
    wovenTexture: pickRandom(SCENE_CONSTANTS.wovenTextures),
    livedInDetail: pickRandom(SCENE_VARIATIONS.livedInDetails),
  };
}
