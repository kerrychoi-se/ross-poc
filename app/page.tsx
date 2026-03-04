"use client";

import { useState } from "react";
import { TypeSelector } from "@/components/TypeSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { ProcessingStep } from "@/components/ProcessingStep";
import { ResultDisplay } from "@/components/ResultDisplay";
import { generateThreeQuarterView } from "@/lib/api-client";
import type { SceneOptions } from "@/lib/prompts/style-system";
import {
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ProductType = "wall-art" | "shelf" | null;
type Variant = "A" | "B" | "C" | "D";
type AppState =
  | "select-type"
  | "upload"
  | "processing"
  | "select-variant"
  | "generating-three-quarter"
  | "result";

interface VariantResult {
  variant: Variant;
  image: string | null;
  error: string | null;
  loading: boolean;
  wordCount: number | null;
  label: string;
  sceneOptions: SceneOptions | null;
}

const VARIANT_DEFS: { variant: Variant; label: string }[] = [
  { variant: "A", label: "A: Medium + No Refs" },
  { variant: "B", label: "B: Medium + Refs" },
  { variant: "C", label: "C: Long + No Refs" },
  { variant: "D", label: "D: Long + Refs" },
];

async function removeBackground(imageData: string): Promise<string> {
  const response = await fetch("/api/remove-background", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageData }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Failed to remove background: ${response.status}`);
  }
  const result = await response.json();
  return result.image;
}

async function generateVariant(
  image: string,
  productType: "wall-art" | "shelf",
  variant: Variant
): Promise<{ image: string; wordCount: number; label: string; sceneOptions: SceneOptions }> {
  const response = await fetch("/api/generate-ab-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, productType, variant }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Variant ${variant} failed: ${response.status}`);
  }
  return response.json();
}

export default function Home() {
  const [productType, setProductType] = useState<ProductType>(null);
  const [appState, setAppState] = useState<AppState>("select-type");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Variant generation state
  const [variants, setVariants] = useState<VariantResult[]>([]);
  const [bgStatus, setBgStatus] = useState<"idle" | "removing" | "done">("idle");
  const [variantsCompleted, setVariantsCompleted] = useState(0);

  // Selection + 3/4 state
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [threeQuarterImage, setThreeQuarterImage] = useState<string | null>(null);
  const [selectedSceneOptions, setSelectedSceneOptions] = useState<SceneOptions | null>(null);
  const [isRegeneratingThreeQuarter, setIsRegeneratingThreeQuarter] = useState(false);

  const handleTypeSelect = (type: ProductType) => {
    setProductType(type);
    setAppState("upload");
  };

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData);
    setAppState("processing");
    setError(null);
    setVariantsCompleted(0);

    const initial: VariantResult[] = VARIANT_DEFS.map((d) => ({
      variant: d.variant,
      image: null,
      error: null,
      loading: true,
      wordCount: null,
      label: d.label,
      sceneOptions: null,
    }));
    setVariants(initial);

    try {
      setBgStatus("removing");
      const transparentImage = await removeBackground(imageData);
      setBgStatus("done");

      setAppState("select-variant");

      const promises = VARIANT_DEFS.map(async (def) => {
        try {
          const res = await generateVariant(transparentImage, productType as "wall-art" | "shelf", def.variant);
          setVariants((prev) =>
            prev.map((r) =>
              r.variant === def.variant
                ? { ...r, image: res.image, wordCount: res.wordCount, loading: false, sceneOptions: res.sceneOptions }
                : r
            )
          );
          setVariantsCompleted((c) => c + 1);
        } catch (err) {
          setVariants((prev) =>
            prev.map((r) =>
              r.variant === def.variant
                ? { ...r, error: err instanceof Error ? err.message : "Unknown error", loading: false }
                : r
            )
          );
          setVariantsCompleted((c) => c + 1);
        }
      });

      await Promise.allSettled(promises);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed during background removal");
      setAppState("upload");
      setBgStatus("idle");
    }
  };

  const handleSelectVariant = async (variant: Variant) => {
    const selected = variants.find((v) => v.variant === variant);
    if (!selected?.image) return;

    setResultImage(selected.image);
    setSelectedSceneOptions(selected.sceneOptions);
    setAppState("generating-three-quarter");

    try {
      const threeQuarterImg = await generateThreeQuarterView(selected.image, productType as "wall-art" | "shelf");
      setThreeQuarterImage(threeQuarterImg);
      setAppState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate 3/4 view");
      setAppState("select-variant");
    }
  };

  const handleRegenerateThreeQuarter = async () => {
    if (!resultImage || !productType) return;

    setIsRegeneratingThreeQuarter(true);
    setError(null);

    try {
      const newThreeQuarterImg = await generateThreeQuarterView(resultImage, productType as "wall-art" | "shelf");
      setThreeQuarterImage(newThreeQuarterImg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate 3/4 view");
    } finally {
      setIsRegeneratingThreeQuarter(false);
    }
  };

  const handleBackToVariants = () => {
    setAppState("select-variant");
    setResultImage(null);
    setThreeQuarterImage(null);
    setSelectedSceneOptions(null);
    setError(null);
  };

  const handleReset = () => {
    setProductType(null);
    setAppState("select-type");
    setUploadedImage(null);
    setResultImage(null);
    setThreeQuarterImage(null);
    setError(null);
    setVariants([]);
    setSelectedSceneOptions(null);
    setBgStatus("idle");
    setVariantsCompleted(0);
  };

  const handleBack = () => {
    if (appState === "upload") {
      setProductType(null);
      setAppState("select-type");
    } else if (appState === "select-variant") {
      setAppState("upload");
      setVariants([]);
      setBgStatus("idle");
      setVariantsCompleted(0);
    } else if (appState === "result") {
      handleBackToVariants();
    }
  };

  return (
    <main className="min-h-screen bg-jasper-white">
      {/* Header */}
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

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back Button */}
        {(appState === "upload" || appState === "select-variant" || appState === "result") && (
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

        {/* Step 1: Select type */}
        {appState === "select-type" && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto">
            <TypeSelector onSelect={handleTypeSelect} />
          </div>
        )}

        {/* Step 2: Upload */}
        {appState === "upload" && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <span className="inline-block px-4 py-2 bg-jasper-cream text-jasper-navy rounded-full text-sm font-medium">
                {productType === "wall-art" ? "Wall Art" : "Shelf"}
              </span>
            </div>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        )}

        {/* Step 3: Processing (BG removal + generating variants) */}
        {appState === "processing" && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto">
            <ProcessingStep
              currentStep={bgStatus === "done" ? "generating-variants" : "removing-background"}
              progress={bgStatus === "done" ? Math.round((variantsCompleted / 4) * 100) : 0}
              variantsCompleted={bgStatus === "done" ? variantsCompleted : undefined}
            />
          </div>
        )}

        {/* Step 4: Select variant */}
        {appState === "select-variant" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-jasper-navy">
                  Choose Your Favorite
                </h2>
                <p className="text-jasper-gray mt-1">
                  Select an image to generate the 3/4 angle view
                </p>
              </div>
              <button onClick={handleReset} className="btn-jasper-secondary text-sm">
                Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variants.map((r) => (
                <VariantCard
                  key={r.variant}
                  result={r}
                  onSelect={() => handleSelectVariant(r.variant)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Generating 3/4 view */}
        {appState === "generating-three-quarter" && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto text-center py-16">
            <Loader2 className="w-12 h-12 text-jasper-coral animate-spin mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
              Generating 3/4 Angle View
            </h2>
            <p className="text-jasper-gray">
              Creating a 3/4 perspective from your selected image...
            </p>
          </div>
        )}

        {/* Step 6: Final result */}
        {appState === "result" && resultImage && threeQuarterImage && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto">
            <ResultDisplay
              imageUrl={resultImage}
              threeQuarterImage={threeQuarterImage}
              originalImage={uploadedImage!}
              onReset={handleReset}
              onRegenerateThreeQuarter={handleRegenerateThreeQuarter}
              isRegenerating={isRegeneratingThreeQuarter}
              sceneOptions={selectedSceneOptions}
              onBackToVariants={handleBackToVariants}
            />
          </div>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Variant Card
// ---------------------------------------------------------------------------

function VariantCard({
  result,
  onSelect,
}: {
  result: VariantResult;
  onSelect: () => void;
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-jasper-cream shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-jasper-cream-light/60 border-b border-jasper-cream">
        <span className="font-mono font-semibold text-jasper-navy text-sm">
          {result.label}
        </span>
        {result.wordCount !== null && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-jasper-cream text-jasper-navy">
            {result.wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-jasper-cream-light/30 flex items-center justify-center">
        {result.loading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-jasper-coral animate-spin" />
            <span className="text-sm text-jasper-gray">Generating...</span>
          </div>
        )}

        {result.error && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <span className="text-sm text-red-600">{result.error}</span>
          </div>
        )}

        {result.image && (
          <img
            src={result.image}
            alt={`Variant ${result.variant} result`}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Scene Options (collapsible) */}
      {result.sceneOptions && (
        <div className="border-t border-jasper-cream">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-left hover:bg-jasper-cream/30 transition-colors"
          >
            <span className="text-xs font-medium text-jasper-navy">Scene Options Used</span>
            {showOptions ? (
              <ChevronUp className="w-3.5 h-3.5 text-jasper-gray" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-jasper-gray" />
            )}
          </button>
          {showOptions && (
            <div className="px-5 pb-3 space-y-1">
              <SceneOptionRow label="Lighting" value={result.sceneOptions.lightingDirection} />
              {result.sceneOptions.wall && <SceneOptionRow label="Wall" value={result.sceneOptions.wall} />}
              {result.sceneOptions.floor && <SceneOptionRow label="Floor" value={result.sceneOptions.floor} />}
              {result.sceneOptions.sofa && <SceneOptionRow label="Sofa" value={result.sceneOptions.sofa} />}
              {result.sceneOptions.propSetName && <SceneOptionRow label="Prop Set" value={result.sceneOptions.propSetName} />}
              <SceneOptionRow label="Fresh Flowers" value={result.sceneOptions.freshFlowers} />
              <SceneOptionRow label="Gold Accent" value={result.sceneOptions.goldAccent} />
              <SceneOptionRow label="Woven Texture" value={result.sceneOptions.wovenTexture} />
            </div>
          )}
        </div>
      )}

      {/* Footer with select button */}
      {result.image && (
        <div className="px-5 py-3 border-t border-jasper-cream flex items-center justify-between">
          <button
            onClick={onSelect}
            className="btn-jasper-primary text-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Use This Image
          </button>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = result.image!;
              link.download = `variant-${result.variant}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 text-sm text-jasper-gray hover:text-jasper-coral transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      )}
    </div>
  );
}

function SceneOptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="font-medium text-jasper-navy whitespace-nowrap min-w-[80px]">
        {label}:
      </span>
      <span className="text-jasper-gray">{value}</span>
    </div>
  );
}
