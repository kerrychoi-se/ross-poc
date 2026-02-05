"use client";

import { Eraser, Wand2, CheckCircle2, Loader2 } from "lucide-react";

interface ProcessingStepProps {
  currentStep: "removing-background" | "generating-view";
  progress: number;
}

const steps = [
  {
    id: "removing-background",
    label: "Removing Background",
    description: "Using Jasper.ai to remove the image background",
    icon: Eraser,
  },
  {
    id: "generating-view",
    label: "Generating Head-On View",
    description: "Using Gemini AI to create a head-on perspective",
    icon: Wand2,
  },
];

export function ProcessingStep({ currentStep, progress }: ProcessingStepProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-jasper-navy mb-2">
          Processing Your Image
        </h2>
        <p className="text-jasper-gray">
          Please wait while we transform your image
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isComplete = index < currentStepIndex || (isActive && progress === 100);
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                isActive
                  ? "bg-jasper-cream/40 border-2 border-jasper-coral/30"
                  : isComplete
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-jasper-cream-light/30 border-2 border-transparent"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-jasper-cream"
                    : isComplete
                    ? "bg-green-100"
                    : "bg-jasper-cream-light"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 text-jasper-coral animate-spin" />
                ) : (
                  <Icon
                    className={`w-6 h-6 ${
                      isPending
                        ? "text-jasper-gray-light"
                        : "text-jasper-gray"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-medium ${
                    isActive
                      ? "text-jasper-coral"
                      : isComplete
                      ? "text-green-700"
                      : "text-jasper-gray"
                  }`}
                >
                  {step.label}
                </h3>
                <p
                  className={`text-sm ${
                    isPending
                      ? "text-jasper-gray-light"
                      : "text-jasper-gray"
                  }`}
                >
                  {step.description}
                </p>

                {isActive && (
                  <div className="mt-3">
                    <div className="h-2 bg-jasper-cream rounded-full overflow-hidden">
                      <div
                        className="h-full bg-jasper-coral rounded-full transition-all duration-500 shimmer"
                        style={{ width: `${Math.max(progress, 30)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-jasper-gray-light">
        This may take a few moments...
      </div>
    </div>
  );
}
