import fs from "fs";
import path from "path";

const REFERENCES_DIR = path.join(process.cwd(), "references");
const MAISON_DIR = path.join(REFERENCES_DIR, "maison");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Reference image with metadata
 */
export interface ReferenceImage {
  data: string; // base64 encoded
  mimeType: string;
  filename: string;
}

/**
 * Get the MIME type for a file extension
 */
function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return mimeTypes[ext.toLowerCase()] || "image/jpeg";
}

/**
 * Load images from a specific directory
 */
async function loadImagesFromDirectory(
  dirPath: string
): Promise<ReferenceImage[]> {
  const references: ReferenceImage[] = [];

  if (!fs.existsSync(dirPath)) {
    return references;
  }

  const files = fs.readdirSync(dirPath);

  const imageFiles = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    })
    .sort();

  for (const filename of imageFiles) {
    const filePath = path.join(dirPath, filename);
    const ext = path.extname(filename);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString("base64");

      references.push({
        data: base64Data,
        mimeType: getMimeType(ext),
        filename,
      });
    } catch (error) {
      console.error(`Failed to load reference image: ${filename}`, error);
    }
  }

  return references;
}

/**
 * Load Maison aesthetic reference images
 *
 * These images define the "Maison Home Casual Luxury" aesthetic
 * and are used for both wall-art and shelf scene generation.
 *
 * Directory: references/maison/
 */
export async function loadMaisonReferences(): Promise<ReferenceImage[]> {
  return loadImagesFromDirectory(MAISON_DIR);
}

/**
 * Load all reference images from the references/ folder
 * Returns them sorted by filename (01.jpg, 02.jpg, etc.)
 *
 * This loads from the maison subdirectory plus any root-level images.
 */
export async function loadReferenceImages(): Promise<ReferenceImage[]> {
  const allReferences: ReferenceImage[] = [];

  // Load from root references directory (legacy support)
  const rootImages = await loadImagesFromDirectory(REFERENCES_DIR);
  allReferences.push(...rootImages);

  // Load from maison subdirectory
  const maisonImages = await loadMaisonReferences();
  allReferences.push(...maisonImages);

  return allReferences;
}

/**
 * Get reference images for scene generation
 * Both wall-art and shelf use the same Maison aesthetic references
 *
 * @param productType - "wall-art" or "shelf" (both use maison references)
 * @returns Maison aesthetic reference images
 */
export async function loadReferencesForProductType(
  productType: "wall-art" | "shelf"
): Promise<ReferenceImage[]> {
  // Both product types use the same Maison aesthetic references
  void productType; // Acknowledge parameter (both types use same refs)
  return loadMaisonReferences();
}

/**
 * Format reference images for Gemini API payload
 * Returns an array of inline_data parts
 */
export async function getReferenceImageParts(): Promise<
  Array<{ inline_data: { mime_type: string; data: string } }>
> {
  const references = await loadReferenceImages();

  return references.map((ref) => ({
    inline_data: {
      mime_type: ref.mimeType,
      data: ref.data,
    },
  }));
}

/**
 * Format Maison reference images for Gemini API payload
 */
export async function getMaisonReferenceImageParts(): Promise<
  Array<{ inline_data: { mime_type: string; data: string } }>
> {
  const references = await loadMaisonReferences();

  return references.map((ref) => ({
    inline_data: {
      mime_type: ref.mimeType,
      data: ref.data,
    },
  }));
}

/**
 * Format reference images for a specific product type for Gemini API payload
 * Both product types use Maison aesthetic references
 */
export async function getReferenceImagePartsForProductType(
  productType: "wall-art" | "shelf"
): Promise<Array<{ inline_data: { mime_type: string; data: string } }>> {
  const references = await loadReferencesForProductType(productType);

  return references.map((ref) => ({
    inline_data: {
      mime_type: ref.mimeType,
      data: ref.data,
    },
  }));
}

/**
 * Check if Maison reference images exist
 */
export function hasMaisonReferences(): boolean {
  if (!fs.existsSync(MAISON_DIR)) {
    return false;
  }

  const files = fs.readdirSync(MAISON_DIR);
  return files.some((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
  });
}

/**
 * Get reference image count
 */
export function getReferenceImageCount(): { root: number; maison: number } {
  const counts = { root: 0, maison: 0 };

  // Count root images
  if (fs.existsSync(REFERENCES_DIR)) {
    const rootFiles = fs.readdirSync(REFERENCES_DIR);
    counts.root = rootFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    }).length;
  }

  // Count maison images
  if (fs.existsSync(MAISON_DIR)) {
    const maisonFiles = fs.readdirSync(MAISON_DIR);
    counts.maison = maisonFiles.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    }).length;
  }

  return counts;
}
