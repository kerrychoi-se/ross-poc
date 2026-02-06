"use client";

import { useState } from "react";
import { TypeSelector } from "@/components/TypeSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { ProcessingStep } from "@/components/ProcessingStep";
import { ResultDisplay } from "@/components/ResultDisplay";
import { removeBackground, generateHeadOnView, generateThreeQuarterView } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";

type ProductType = "wall-art" | "shelf" | null;
type AppState = "select-type" | "upload" | "processing" | "result";

interface ProcessingStatus {
  step: "removing-background" | "generating-view" | "generating-three-quarter";
  progress: number;
}

export default function Home() {
  const [productType, setProductType] = useState<ProductType>(null);
  const [appState, setAppState] = useState<AppState>("select-type");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [threeQuarterImage, setThreeQuarterImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTypeSelect = (type: ProductType) => {
    setProductType(type);
    setAppState("upload");
  };

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData);
    setAppState("processing");
    setError(null);

    try {
      // Step 1: Remove background
      setProcessingStatus({ step: "removing-background", progress: 0 });
      const transparentImage = await removeBackground(imageData);
      setProcessingStatus({ step: "removing-background", progress: 100 });

      // Step 2: Generate head-on view
      setProcessingStatus({ step: "generating-view", progress: 0 });
      const generatedImage = await generateHeadOnView(transparentImage, productType!);
      setProcessingStatus({ step: "generating-view", progress: 100 });

      // Step 3: Generate 3/4 angle view from the head-on image
      setProcessingStatus({ step: "generating-three-quarter", progress: 0 });
      const threeQuarterImg = await generateThreeQuarterView(generatedImage, productType!);
      setProcessingStatus({ step: "generating-three-quarter", progress: 100 });

      setResultImage(generatedImage);
      setThreeQuarterImage(threeQuarterImg);
      setAppState("result");
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during processing");
      setAppState("upload");
    } finally {
      setProcessingStatus(null);
    }
  };

  const handleReset = () => {
    setProductType(null);
    setAppState("select-type");
    setUploadedImage(null);
    setResultImage(null);
    setThreeQuarterImage(null);
    setError(null);
    setProcessingStatus(null);
  };

  const handleBack = () => {
    if (appState === "upload") {
      setProductType(null);
      setAppState("select-type");
    } else if (appState === "result") {
      setAppState("upload");
      setResultImage(null);
      setThreeQuarterImage(null);
    }
  };

  return (
    <main className="min-h-screen bg-jasper-white">
      {/* Cream Banner Header */}
      <div className="bg-jasper-cream py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <header className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-jasper-navy mb-3 tracking-tight">
              Ross POC
            </h1>
            <p className="text-jasper-gray text-lg">
              Transform product images into stunning lifestyle scenes
            </p>
          </header>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Button */}
        {appState !== "select-type" && appState !== "processing" && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-jasper-gray hover:text-jasper-coral transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="jasper-card animate-fade-in">
          {appState === "select-type" && (
            <TypeSelector onSelect={handleTypeSelect} />
          )}

          {appState === "upload" && (
            <div>
              <div className="mb-6 text-center">
                <span className="inline-block px-4 py-2 bg-jasper-cream text-jasper-navy rounded-full text-sm font-medium">
                  {productType === "wall-art" ? "Wall Art" : "Shelf"}
                </span>
              </div>
              <ImageUploader onUpload={handleImageUpload} />
            </div>
          )}

          {appState === "processing" && processingStatus && (
            <ProcessingStep
              currentStep={processingStatus.step}
              progress={processingStatus.progress}
            />
          )}

          {appState === "result" && resultImage && threeQuarterImage && (
            <ResultDisplay
              imageUrl={resultImage}
              threeQuarterImage={threeQuarterImage}
              originalImage={uploadedImage!}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
