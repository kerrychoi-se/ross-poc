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
    primary: "Natural window light, Left 45-degree angle",
    quality: "Soft, diffused through sheer linen",
    temperature: "5500K neutral daylight",
    shadows: "Soft contact shadows, not harsh or dramatic",
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
      backWall: "White shiplap wood paneling",
      description: "Horizontal wood planks with visible grain",
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
