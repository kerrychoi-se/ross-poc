"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              textAlign: "center",
              padding: "2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(26, 26, 56, 0.08)",
              boxShadow: "0 4px 6px -1px rgba(26, 26, 56, 0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1A1A38",
                marginBottom: "1rem",
              }}
            >
              Something went wrong!
            </h2>
            <p
              style={{
                color: "#6B6B7B",
                marginBottom: "1.5rem",
              }}
            >
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#FF5C35",
                color: "#FFFFFF",
                fontWeight: 600,
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
