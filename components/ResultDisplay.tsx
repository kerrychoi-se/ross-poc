"use client";

import { useState } from "react";
import { Download, RefreshCw, ArrowLeftRight } from "lucide-react";

interface ResultDisplayProps {
  imageUrl: string;
  originalImage: string;
  onReset: () => void;
}

export function ResultDisplay({ imageUrl, originalImage, onReset }: ResultDisplayProps) {
  const [showComparison, setShowComparison] = useState(false);

  const handleDownload = async () => {
    try {
      // Convert base64 to blob if needed
      let blob: Blob;
      
      if (imageUrl.startsWith("data:")) {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `processed-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
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

      {/* Image Display */}
      <div className="bg-jasper-cream-light rounded-xl p-4">
        {showComparison ? (
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
                Processed
              </p>
              <div className="bg-jasper-white rounded-lg p-2">
                <img
                  src={imageUrl}
                  alt="Processed"
                  className="max-h-[300px] w-full object-contain rounded"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Processed result"
              className="max-h-[500px] max-w-full object-contain rounded-lg"
            />
          </div>
        )}
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
          onClick={handleDownload}
          className="btn-jasper-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download
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
