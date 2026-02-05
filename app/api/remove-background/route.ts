import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Jasper API limits: 30MB file size, 25 megapixels (5000x5000 max)
const MAX_DIMENSION = 5000;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.JASPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Jasper API key not configured" },
        { status: 500 }
      );
    }

    // Extract base64 data from data URL if present
    let base64Image = image;
    if (image.includes(",")) {
      base64Image = image.split(",")[1];
    }

    // Decode the image and check/resize dimensions
    const imageBuffer = Buffer.from(base64Image, "base64");
    const sharpImage = sharp(imageBuffer);
    const metadata = await sharpImage.metadata();
    
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Resize if exceeds Jasper limits
    let processedBuffer = imageBuffer;
    if (originalWidth > MAX_DIMENSION || originalHeight > MAX_DIMENSION) {
      processedBuffer = await sharpImage
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
        .toBuffer();
    }

    // Build the request payload as FormData (Jasper expects multipart/form-data)
    const jasperEndpoint = "https://api.jasper.ai/v1/image/remove-background";
    
    // Create a Blob from the buffer and add to FormData
    const imageBlob = new Blob([processedBuffer], { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("image_file", imageBlob, "image.jpg");

    // Call Jasper.ai Remove Background API
    const response = await fetch(jasperEndpoint, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        // Note: Don't set Content-Type for FormData - fetch will set it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jasper API error:", errorText);
      return NextResponse.json(
        { error: `Jasper API error: ${response.status}` },
        { status: response.status }
      );
    }

    const responseContentType = response.headers.get('content-type');

    // Check if response is JSON or binary image
    let transparentImage: string;
    
    if (responseContentType?.includes('application/json')) {
      const result = await response.json();

      // Return the transparent image
      // The actual response structure may vary - adjust based on Jasper API docs
      transparentImage = result.image || result.data?.image || result.result;

      if (!transparentImage) {
        return NextResponse.json(
          { error: "No image returned from Jasper API" },
          { status: 500 }
        );
      }
    } else {
      // Response is binary image data
      const imageBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      transparentImage = `data:${responseContentType || 'image/png'};base64,${base64}`;
    }

    return NextResponse.json({
      image: transparentImage.startsWith("data:")
        ? transparentImage
        : `data:image/png;base64,${transparentImage}`,
    });
  } catch (error) {
    console.error("Remove background error:", error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
