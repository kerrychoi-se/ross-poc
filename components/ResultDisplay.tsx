"use client";

import { useState } from "react";
import { Download, RefreshCw, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";
import type { SceneOptions } from "@/lib/prompts/style-system";

interface ResultDisplayProps {
  imageUrl: string;
  threeQuarterImage: string;
  originalImage: string;
  onReset: () => void;
  onRegenerateThreeQuarter: () => void;
  isRegenerating: boolean;
  sceneOptions?: SceneOptions | null;
}

export function ResultDisplay({ imageUrl, threeQuarterImage, originalImage, onReset, onRegenerateThreeQuarter, isRegenerating, sceneOptions }: ResultDisplayProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [showSceneOptions, setShowSceneOptions] = useState(false);

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

      {/* Scene Options (collapsible) */}
      {sceneOptions && (
        <div className="bg-jasper-cream-light rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSceneOptions(!showSceneOptions)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-jasper-cream/50 transition-colors"
          >
            <p className="text-sm font-medium text-jasper-navy">
              Scene Options Used
            </p>
            {showSceneOptions ? (
              <ChevronUp className="w-4 h-4 text-jasper-gray" />
            ) : (
              <ChevronDown className="w-4 h-4 text-jasper-gray" />
            )}
          </button>
          {showSceneOptions && (
            <div className="px-4 pb-4 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <SceneOptionRow label="Lighting" value={sceneOptions.lightingDirection} />
                {sceneOptions.wall && (
                  <SceneOptionRow label="Wall" value={sceneOptions.wall} />
                )}
                {sceneOptions.floor && (
                  <SceneOptionRow label="Floor" value={sceneOptions.floor} />
                )}
                {sceneOptions.sofa && (
                  <SceneOptionRow label="Sofa" value={sceneOptions.sofa} />
                )}
                {sceneOptions.propSetName && (
                  <SceneOptionRow label="Prop Set" value={sceneOptions.propSetName} />
                )}
                <SceneOptionRow label="Fresh Flowers" value={sceneOptions.freshFlowers} />
                <SceneOptionRow label="Gold Accent" value={sceneOptions.goldAccent} />
                <SceneOptionRow label="Woven Texture" value={sceneOptions.wovenTexture} />
              </div>
            </div>
          )}
        </div>
      )}

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

function SceneOptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="font-medium text-jasper-navy whitespace-nowrap min-w-[100px]">
        {label}:
      </span>
      <span className="text-jasper-gray">{value}</span>
    </div>
  );
}
