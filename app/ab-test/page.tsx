"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TypeSelector } from "@/components/TypeSelector";
import { ArrowLeft, Upload, X, Image as ImageIcon, Download, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import JSZip from "jszip";

type ProductType = "wall-art" | "shelf" | null;
type Variant = "A" | "B" | "C" | "D" | "E" | "F";
type AppState = "select-type" | "upload" | "processing" | "results";

interface VariantResult {
  variant: Variant;
  image: string | null;
  error: string | null;
  loading: boolean;
  wordCount: number | null;
  label: string;
}

const VARIANT_DEFS: { variant: Variant; label: string; description: string }[] = [
  { variant: "A", label: "A: Long + No Refs (Nano Banana 2)",  description: "~2,500 words, no refs, gemini-3.1-flash" },
  { variant: "B", label: "B: Long + Refs (Nano Banana 2)",     description: "~2,500 words, with refs, gemini-3.1-flash" },
  { variant: "C", label: "C: Medium + No Refs (Pro)",          description: "~1,000 words, no refs, gemini-3-pro" },
  { variant: "D", label: "D: Medium + Refs (Pro)",             description: "~1,000 words, with refs, gemini-3-pro" },
  { variant: "E", label: "E: Long + No Refs (Pro)",            description: "~2,500 words, no refs, gemini-3-pro" },
  { variant: "F", label: "F: Long + Refs (Pro)",               description: "~2,500 words, with refs, gemini-3-pro" },
];

const VARIANT_SLUG: Record<Variant, string> = {
  A: "long-no-refs-nb2",
  B: "long-with-refs-nb2",
  C: "medium-no-refs-pro",
  D: "medium-with-refs-pro",
  E: "long-no-refs-pro",
  F: "long-with-refs-pro",
};

function buildTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function base64ToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function buildSummaryText(
  productType: string,
  timestamp: string,
  results: VariantResult[]
): string {
  const lines = [
    `A/B Test Run — ${timestamp.replace("T", " ").replace(/(\d{4}-\d{2}-\d{2}) (\d{2})-(\d{2})-(\d{2})/, "$1 $2:$3:$4")}`,
    `Product Type: ${productType}`,
    "========================================",
  ];
  for (const r of results) {
    const slug = VARIANT_SLUG[r.variant];
    const words = r.wordCount !== null ? `${r.wordCount} words` : "—";
    const status = r.image ? "✓ saved" : `✗ error: ${r.error ?? "unknown"}`;
    lines.push(`${r.variant.padEnd(4)} ${slug.padEnd(22)} ${words.padEnd(14)} ${status}`);
  }
  return lines.join("\n") + "\n";
}

async function generateAndDownloadZip(
  productType: string,
  results: VariantResult[]
) {
  const ts = buildTimestamp();
  const folderName = `ab-test_${productType}_${ts}`;
  const zip = new JSZip();
  const folder = zip.folder(folderName)!;

  for (const r of results) {
    if (!r.image) continue;
    const filename = `${r.variant}_${VARIANT_SLUG[r.variant]}.png`;
    folder.file(filename, base64ToUint8Array(r.image));
  }

  folder.file("summary.txt", buildSummaryText(productType, ts, results));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function logSummary(productType: string, results: VariantResult[]) {
  const rows = results.map((r) => ({
    Variant: r.variant,
    Config: VARIANT_SLUG[r.variant],
    Words: r.wordCount ?? "—",
    Status: r.image ? "✓ saved" : `✗ ${r.error ?? "unknown"}`,
  }));
  console.log(`\n[A/B Test] Run complete — ${productType}`);
  console.table(rows);
}

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
): Promise<{ image: string; wordCount: number; label: string }> {
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

function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ABTestPage() {
  const [productType, setProductType] = useState<ProductType>(null);
  const [appState, setAppState] = useState<AppState>("select-type");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bgStatus, setBgStatus] = useState<"idle" | "removing" | "done">("idle");
  const [results, setResults] = useState<VariantResult[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasDownloadedRef = useRef(false);

  useEffect(() => {
    if (results.length === 0) return;
    const allSettled = results.every((r) => !r.loading);
    if (!allSettled || hasDownloadedRef.current) return;

    hasDownloadedRef.current = true;
    logSummary(productType!, results);
    generateAndDownloadZip(productType!, results).catch((err) =>
      console.error("[A/B Test] ZIP download failed:", err)
    );
  }, [results, productType]);

  const handleTypeSelect = (type: "wall-art" | "shelf") => {
    setProductType(type);
    setAppState("upload");
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleRunTest = async () => {
    if (!preview || !productType) return;

    setAppState("processing");
    setGlobalError(null);

    const initial: VariantResult[] = VARIANT_DEFS.map((d) => ({
      variant: d.variant,
      image: null,
      error: null,
      loading: true,
      wordCount: null,
      label: d.label,
    }));
    setResults(initial);

    try {
      setBgStatus("removing");
      const transparentImage = await removeBackground(preview);
      setBgStatus("done");

      setAppState("results");

      const promises = VARIANT_DEFS.map(async (def) => {
        try {
          const res = await generateVariant(transparentImage, productType, def.variant);
          setResults((prev) =>
            prev.map((r) =>
              r.variant === def.variant
                ? { ...r, image: res.image, wordCount: res.wordCount, loading: false }
                : r
            )
          );
        } catch (err) {
          setResults((prev) =>
            prev.map((r) =>
              r.variant === def.variant
                ? { ...r, error: err instanceof Error ? err.message : "Unknown error", loading: false }
                : r
            )
          );
        }
      });

      await Promise.allSettled(promises);
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Failed during background removal"
      );
      setAppState("upload");
      setBgStatus("idle");
    }
  };

  const handleReset = () => {
    setProductType(null);
    setAppState("select-type");
    setPreview(null);
    setFileName(null);
    setResults([]);
    setGlobalError(null);
    setBgStatus("idle");
    hasDownloadedRef.current = false;
  };

  const handleBack = () => {
    if (appState === "upload") {
      setProductType(null);
      setAppState("select-type");
      setPreview(null);
      setFileName(null);
    } else if (appState === "results") {
      setAppState("upload");
      setResults([]);
      setBgStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-jasper-white">
      {/* Header */}
      <div className="bg-jasper-cream py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <header className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-jasper-navy mb-3 tracking-tight">
              A–F Prompt Test
            </h1>
            <p className="text-jasper-gray text-lg">
              Compare 6 prompt variants side-by-side
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm text-jasper-coral hover:underline"
            >
              &larr; Back to main app
            </Link>
          </header>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back button */}
        {(appState === "upload" || appState === "results") && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-jasper-gray hover:text-jasper-coral transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        )}

        {/* Global error */}
        {globalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {globalError}
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
            <div className="space-y-6">
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-jasper-cream text-jasper-navy rounded-full text-sm font-medium mb-4">
                  {productType === "wall-art" ? "Wall Art" : "Shelf"}
                </span>
                <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
                  Upload Your Image
                </h2>
                <p className="text-jasper-gray">
                  This image will be tested across all 6 prompt variants
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                accept="image/*"
                className="hidden"
              />

              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="drop-zone cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="w-16 h-16 bg-jasper-cream rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-jasper-coral" />
                  </div>
                  <p className="text-lg font-medium text-jasper-navy mb-1">
                    Drop your image here
                  </p>
                  <p className="text-sm text-jasper-gray">or click to browse</p>
                  <p className="text-xs text-jasper-gray-light mt-4">
                    Supports: JPG, PNG, WebP, GIF
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-jasper-cream-light rounded-xl p-4">
                    <button
                      onClick={() => {
                        setPreview(null);
                        setFileName(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-2 bg-jasper-white rounded-full shadow-md hover:bg-jasper-cream transition-colors"
                    >
                      <X className="w-5 h-5 text-jasper-gray" />
                    </button>
                    <div className="flex items-center justify-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-[400px] max-w-full object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-jasper-cream-light/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-jasper-gray" />
                      <span className="text-sm text-jasper-navy truncate max-w-[200px]">
                        {fileName}
                      </span>
                    </div>
                    <button onClick={handleRunTest} className="btn-jasper-primary">
                      Run A/B Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: BG removal in progress */}
        {appState === "processing" && bgStatus === "removing" && (
          <div className="jasper-card animate-fade-in max-w-4xl mx-auto text-center py-16">
            <Loader2 className="w-12 h-12 text-jasper-coral animate-spin mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
              Removing Background
            </h2>
            <p className="text-jasper-gray">
              Preparing your image for the 6-variant test...
            </p>
          </div>
        )}

        {/* Step 4: Results grid */}
        {appState === "results" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-jasper-navy">
                Results
              </h2>
              <button onClick={handleReset} className="btn-jasper-primary text-sm">
                New Test
              </button>
            </div>

            {/* 2x3 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((r) => (
                <VariantCard key={r.variant} result={r} productType={productType!} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function VariantCard({ result, productType }: { result: VariantResult; productType: string }) {
  const def = VARIANT_DEFS.find((d) => d.variant === result.variant)!;

  return (
    <div className="bg-white rounded-2xl border border-jasper-cream shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 bg-jasper-cream-light/60 border-b border-jasper-cream">
        <div>
          <span className="font-mono font-semibold text-jasper-navy text-sm">
            {def.label}
          </span>
          <span className="block text-[11px] text-jasper-gray">{def.description}</span>
        </div>
        {result.wordCount !== null && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-jasper-cream text-jasper-navy">
            {result.wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      {/* Card body */}
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

      {/* Card footer */}
      {result.image && (
        <div className="px-5 py-3 border-t border-jasper-cream flex justify-end">
          <button
            onClick={() =>
              downloadImage(result.image!, `ab-test_${productType}_${result.variant}_${VARIANT_SLUG[result.variant]}.png`)
            }
            className="flex items-center gap-1.5 text-sm text-jasper-coral hover:text-jasper-navy transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
