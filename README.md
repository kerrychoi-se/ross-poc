# Ross POC

AI-powered product lifestyle scene generator that transforms product images into photorealistic interior scenes.

## Overview

Ross POC is a Next.js application that takes product images (wall art or shelves) and generates stunning lifestyle photography scenes using AI. The application features a two-step pipeline:

1. **Background Removal** - Extracts the product from its original background using Jasper.ai
2. **Scene Generation** - Composites the product into a beautifully styled interior scene using Google Gemini's image generation capabilities

The generated scenes follow the "Maison Home Casual Luxury" aesthetic with natural lighting, textured materials, and a warm neutral palette with touches of gold and fresh flowers.

## Features

- **Two Product Types**: Support for wall art (framed artwork, canvas prints, posters) and shelves (floating shelves, display units)
- **AI-Powered Processing**: Leverages Jasper.ai for background removal and Google Gemini for scene generation
- **Identity Lock Protocol**: Preserves original product pixels exactly - no style transfer or modifications to your product
- **Sophisticated Prompt Engineering**: Physics-aware compositing with realistic shadows and lighting
- **Reference Image System**: Uses style reference images for consistent aesthetic guidance
- **Modern UI**: Drag-and-drop upload, real-time progress indicators, and before/after comparison
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS
- **Image Processing**: Sharp
- **Icons**: Lucide React
- **APIs**: Jasper.ai (background removal), Google Gemini (scene generation)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Jasper.ai API key
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ross-poc.git
   cd ross-poc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` with your API keys (see Environment Variables section below)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file based on `.env.local.example`:

| Variable | Description | Required |
|----------|-------------|----------|
| `JASPER_API_KEY` | Your Jasper.ai API key for background removal | Yes |
| `GEMINI_API_KEY` | Your Google Gemini API key for scene generation | Yes |
| `GEMINI_MODEL` | Gemini model to use (default: `gemini-3-pro-image-preview`) | No |
| `GEMINI_ASPECT_RATIO` | Output aspect ratio (default: `1:1`) | No |
| `GEMINI_IMAGE_SIZE` | Output size: `1K`, `2K`, or `4K` (default: `2K`) | No |

## Usage

1. **Select Product Type**: Choose between "Wall Art" or "Shelf"
2. **Upload Image**: Drag and drop or click to upload your product image
3. **Processing**: The app will:
   - Remove the background from your image
   - Generate a lifestyle scene with your product
4. **View Results**: Compare before/after and download the generated image

## Project Structure

```
ross-poc/
├── app/
│   ├── api/
│   │   ├── generate-view/      # Gemini scene generation endpoint
│   │   └── remove-background/  # Jasper background removal endpoint
│   ├── globals.css             # Global styles and Tailwind
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application page
├── components/
│   ├── ImageUploader.tsx       # Drag-and-drop image upload
│   ├── ProcessingStep.tsx      # Processing status display
│   ├── ResultDisplay.tsx       # Before/after comparison view
│   └── TypeSelector.tsx        # Product type selection
├── lib/
│   ├── api-client.ts           # Frontend API client
│   ├── references.ts           # Reference image loader
│   └── prompts/
│       ├── wall-art-prompt.ts  # Wall art scene prompts
│       ├── shelf-prompt.ts     # Shelf scene prompts
│       ├── style-system.ts     # Aesthetic DNA configuration
│       └── negative-reference.ts # Negative prompt guidance
├── references/
│   └── maison/                 # Style reference images
└── public/                     # Static assets
```

## API Reference

### POST `/api/remove-background`

Removes the background from an uploaded image.

**Request Body:**
```json
{
  "image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "image": "data:image/png;base64,..."
}
```

### POST `/api/generate-view`

Generates a lifestyle scene with the provided product image.

**Request Body:**
```json
{
  "image": "data:image/png;base64,...",
  "productType": "wall-art" | "shelf"
}
```

**Response:**
```json
{
  "image": "data:image/png;base64,..."
}
```

## How It Works

### Scene Generation

The application uses sophisticated prompt engineering to generate realistic lifestyle scenes:

1. **Identity Lock Protocol**: The original product image is treated as a "fixed geometric constant" - the AI is instructed to preserve every pixel exactly as provided.

2. **Physics-Aware Compositing**: For wall art, the system generates realistic shadows cast onto the wall. For shelves, it creates props that respect gravity and rest naturally on surfaces.

3. **Aesthetic DNA**: All scenes follow the "Maison Home Casual Luxury" style:
   - Natural window light (5500K, 45-degree angle)
   - Cream, oatmeal, and warm white palette
   - High-texture materials (Belgian linen, bouclé, matte stoneware)
   - Textured plaster walls or shiplap paneling

### Reference Images

Style reference images can be placed in the `references/maison/` folder to guide the AI's aesthetic choices. These images inform lighting quality, material textures, and overall atmosphere.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

---

Built with Next.js, React, and AI magic.
