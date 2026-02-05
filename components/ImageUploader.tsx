"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (imageData: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (preview) {
      onUpload(preview);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
          Upload Your Image
        </h2>
        <p className="text-jasper-gray">
          Drag and drop or click to select an image
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-zone cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
            isDragging ? "dragging" : ""
          }`}
        >
          <div className="w-16 h-16 bg-jasper-cream rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-jasper-coral" />
          </div>
          <p className="text-lg font-medium text-jasper-navy mb-1">
            Drop your image here
          </p>
          <p className="text-sm text-jasper-gray">
            or click to browse
          </p>
          <p className="text-xs text-jasper-gray-light mt-4">
            Supports: JPG, PNG, WebP, GIF
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-jasper-cream-light rounded-xl p-4">
            <button
              onClick={handleClear}
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
            <button
              onClick={handleSubmit}
              className="btn-jasper-primary"
            >
              Process Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
