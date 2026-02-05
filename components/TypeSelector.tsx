"use client";

import { Frame, Layers } from "lucide-react";

interface TypeSelectorProps {
  onSelect: (type: "wall-art" | "shelf") => void;
}

export function TypeSelector({ onSelect }: TypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
          Select Product Type
        </h2>
        <p className="text-jasper-gray">
          Choose the type of product you want to process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wall Art Card */}
        <button
          onClick={() => onSelect("wall-art")}
          className="type-card group p-8 bg-jasper-cream-light rounded-xl border-2 border-transparent hover:border-jasper-coral text-left"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-jasper-cream rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Frame className="w-8 h-8 text-jasper-coral" />
            </div>
            <h3 className="font-display text-xl font-semibold text-jasper-navy mb-2">
              Wall Art
            </h3>
            <p className="text-jasper-gray text-sm">
              Framed artwork, canvas prints, posters, and wall decorations
            </p>
          </div>
        </button>

        {/* Shelf Card */}
        <button
          onClick={() => onSelect("shelf")}
          className="type-card group p-8 bg-jasper-cream-light rounded-xl border-2 border-transparent hover:border-jasper-coral text-left"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-jasper-cream rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8 text-jasper-coral" />
            </div>
            <h3 className="font-display text-xl font-semibold text-jasper-navy mb-2">
              Shelf
            </h3>
            <p className="text-jasper-gray text-sm">
              Floating shelves, mounted shelving, and display units
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
