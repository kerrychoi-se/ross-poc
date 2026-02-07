"use client";

import { useState } from "react";
import { Download, RefreshCw, ArrowLeftRight } from "lucide-react";

interface ResultDisplayProps {
  imageUrl: string;
  threeQuarterImage: string;
  originalImage: string;
  onReset: () => void;
  onRegenerateThreeQuarter: () => void;
  isRegenerating: boolean;
}

export function ResultDisplay({ imageUrl, threeQuarterImage, originalImage, onReset, onRegenerateThreeQuarter, isRegenerating }: ResultDisplayProps) {
  const [showComparison, setShowComparison] = useState(false);

  const handleDownload = async (dataUrl: string, filename: string) => {
    try {
      let blob: Blob;

      if (dataUrl.startsWith("data:")) {
        const response = await fetch(dataUrl);
        blob = await response.blob();
      } else {
        const response = await fetch(dataUrl);
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDownloadAll = async () => {
    await handleDownload(imageUrl, `head-on-view-${Date.now()}.png`);
    // Small delay between downloads to avoid browser blocking
    await new Promise((resolve) => setTimeout(resolve, 500));
    await handleDownload(threeQuarterImage, `three-quarter-view-${Date.now()}.png`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
          Processing Complete!
        </h2>
        <p className="text-jasper-gray">
          Your image has been transformed successfully
        </p>
      </div>

      {/* Comparison View */}
      {showComparison && (
        <div className="bg-jasper-cream-light rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-jasper-gray text-center">
                Original
              </p>
              <div className="bg-jasper-white rounded-lg p-2">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-[300px] w-full object-contain rounded"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-jasper-gray text-center">
                Head-On View
              </p>
              <div className="bg-jasper-white rounded-lg p-2">
                <img
                  src={imageUrl}
                  alt="Head-on view"
                  className="max-h-[300px] w-full object-contain rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Head-On View */}
      <div className="bg-jasper-cream-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-jasper-navy">
            Head-On View
          </p>
          <button
            onClick={() => handleDownload(imageUrl, `head-on-view-${Date.now()}.png`)}
            className="text-jasper-gray hover:text-jasper-coral transition-colors flex items-center gap-1 text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Head-on view result"
            className="max-h-[400px] max-w-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* 3/4 Angle View */}
      <div className="bg-jasper-cream-light rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-jasper-navy">
            3/4 Angle View
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onRegenerateThreeQuarter}
              disabled={isRegenerating}
              className="text-jasper-gray hover:text-jasper-coral transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>
            <button
              onClick={() => handleDownload(threeQuarterImage, `three-quarter-view-${Date.now()}.png`)}
              disabled={isRegenerating}
              className="text-jasper-gray hover:text-jasper-coral transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          {isRegenerating && (
            <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-jasper-coral animate-spin" />
                <p className="text-sm font-medium text-jasper-navy">Regenerating 3/4 view...</p>
              </div>
            </div>
          )}
          <img
            src={threeQuarterImage}
            alt="3/4 angle view result"
            className={`max-h-[400px] max-w-full object-contain rounded-lg ${isRegenerating ? "opacity-40" : ""}`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="btn-jasper-secondary flex items-center gap-2"
        >
          <ArrowLeftRight className="w-5 h-5" />
          {showComparison ? "Hide Comparison" : "Compare"}
        </button>

        <button
          onClick={handleDownloadAll}
          className="btn-jasper-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download All
        </button>

        <button
          onClick={onReset}
          className="btn-jasper-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
}
