/**
 * API client helper functions for the Ross POC application
 */

/**
 * Remove background from an image using Jasper.ai API
 * @param imageData - Base64 encoded image data (with or without data URL prefix)
 * @returns Promise<string> - Base64 encoded transparent image with data URL prefix
 */
export async function removeBackground(imageData: string): Promise<string> {
  const response = await fetch("/api/remove-background", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageData }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to remove background: ${response.status}`);
  }

  const result = await response.json();
  return result.image;
}

/**
 * Generate a head-on view of the product using Gemini API
 * @param imageData - Base64 encoded transparent image data
 * @param productType - Type of product ("wall-art" or "shelf")
 * @returns Promise<string> - Base64 encoded generated image with data URL prefix
 */
export async function generateHeadOnView(
  imageData: string,
  productType: "wall-art" | "shelf"
): Promise<string> {
  const response = await fetch("/api/generate-view", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageData,
      productType,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to generate view: ${response.status}`);
  }

  const result = await response.json();
  return result.image;
}
