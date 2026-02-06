"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-jasper-white flex items-center justify-center px-6">
      <div className="jasper-card max-w-md w-full text-center">
        <h2 className="font-display text-2xl font-bold text-jasper-navy mb-4">
          Something went wrong!
        </h2>
        <p className="text-jasper-gray mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="btn-jasper-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
