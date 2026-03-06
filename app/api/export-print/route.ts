import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";

const TARGET_PX = 7200;
const TARGET_DPI = 300;

async function convertToPrintTiff(dataUrl: string): Promise<Buffer> {
  let base64Data = dataUrl;
  if (dataUrl.includes(",")) {
    base64Data = dataUrl.split(",")[1];
  }

  const inputBuffer = Buffer.from(base64Data, "base64");

  const tiffBuffer = await sharp(inputBuffer, { limitInputPixels: false })
    .resize(TARGET_PX, TARGET_PX, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .toColourspace("cmyk")
    .withMetadata({ density: TARGET_DPI })
    .tiff({ compression: "lzw" })
    .toBuffer();

  return tiffBuffer;
}

export async function POST(request: NextRequest) {
  try {
    const { headOnImage, threeQuarterImage } = await request.json();

    if (!headOnImage || !threeQuarterImage) {
      return NextResponse.json(
        { error: "Both headOnImage and threeQuarterImage are required" },
        { status: 400 }
      );
    }

    const [headOnTiff, threeQuarterTiff] = await Promise.all([
      convertToPrintTiff(headOnImage),
      convertToPrintTiff(threeQuarterImage),
    ]);

    const zip = new JSZip();
    zip.file("head-on-view-cmyk-24x24.tiff", headOnTiff);
    zip.file("three-quarter-view-cmyk-24x24.tiff", threeQuarterTiff);

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="print-ready-cmyk-24x24.zip"',
      },
    });
  } catch (error) {
    console.error("Export print error:", error);
    return NextResponse.json(
      { error: "Failed to generate print-ready files" },
      { status: 500 }
    );
  }
}
