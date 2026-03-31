"use client";

import { type LucideIcon } from "lucide-react";
import { SlideUp } from "@/components/ui/motion";

interface OnboardingStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  image?: string;
}

export function OnboardingStep({
  icon: Icon,
  title,
  description,
  image,
}: OnboardingStepProps) {
  return (
    <SlideUp className="flex flex-col items-center text-center">
      {/* Icon */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950">
        <Icon className="h-12 w-12 text-brand-500" />
      </div>

      {/* Title */}
      <h2 className="mb-4 text-2xl font-bold text-surface-900 dark:text-surface-50">
        {title}
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-md text-lg text-surface-500 dark:text-surface-400">
        {description}
      </p>

      {/* Illustration placeholder */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="mx-auto h-48 w-auto object-contain"
        />
      ) : (
        <div className="mx-auto flex h-48 w-64 items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800">
          <p className="text-sm text-surface-400">Illustration</p>
        </div>
      )}
    </SlideUp>
  );
}
