# Reference Images

This folder contains style reference images for lifestyle scene generation. Reference images inform the AI about the target aesthetic, lighting, and material quality.

## Directory Structure

```
references/
├── maison/         # MAISON_AESTHETIC_REF - Lighting and environment references
│   ├── 01.jpg
│   └── ...
└── README.md
```

## Reference Usage

### `/maison/` - Maison Home Casual Luxury Aesthetic

These images define the target aesthetic for **all scene generation** (both wall art and shelf). They guide:
- Natural lighting quality (soft daylight, 5500K, Left 45-degree angle)
- Room atmosphere and environment style
- Wall texture and flooring aesthetics
- Material palette (cream, oatmeal, warm whites, light oak)
- Overall "Maison Home Casual Luxury" vibe

**Best practices:**
- Include images showing soft, diffused natural light
- Show textured matte plaster walls and shiplap paneling
- Demonstrate the cream/oatmeal/warm white palette
- Include wide-angle interior photography examples
- Show high-texture fabrics (Belgian linen, bouclé, chunky wool)

## Image Limits

According to Gemini API documentation:

| Limit | Count |
|-------|-------|
| Total reference images per request | Up to 14 |
| High-fidelity object images | Up to 6 |
| Style reference images | Recommended 4 |

## Naming Convention

Name your reference images sequentially:
- `01.jpg`
- `02.jpg`
- `03.jpg`
- `04.jpg`

Images are loaded in alphabetical order.

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Aesthetic DNA

These reference images should demonstrate the **Maison Home Casual Luxury** style:

| Property | Description |
|----------|-------------|
| **Lighting** | Natural window light, Left 45-degree angle, soft contact shadows |
| **Palette** | Cream, oatmeal, warm whites, light oak accents |
| **Materials** | High-texture woven fabrics, Belgian linen, matte stoneware |
| **Surfaces** | Textured matte white plaster (wall-art), White shiplap (shelf) |
| **Flooring** | Plank-cut light oak with visible grain |
| **Composition** | 35mm lens, f/8.0, eye-level head-on, minimalist with negative space |

## Usage

Reference images from `/maison/` are automatically loaded and included in all Gemini API requests, regardless of product type (wall art or shelf).

The system also supports legacy images placed directly in `/references/` (root level).

## Note

Image files in this folder are excluded from version control via `.gitignore` since they are large and user-specific.
