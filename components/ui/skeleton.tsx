"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded h-4 w-full",
  circular: "rounded-full",
  rectangular: "rounded-lg",
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, style, ...props }, ref) => {
    const sizeStyle: React.CSSProperties = {
      ...style,
      ...(width != null ? { width: typeof width === "number" ? `${width}px` : width } : {}),
      ...(height != null ? { height: typeof height === "number" ? `${height}px` : height } : {}),
    };

    // For circular, match width and height if only one is provided
    if (variant === "circular") {
      const dim = width ?? height ?? 40;
      const dimValue = typeof dim === "number" ? `${dim}px` : dim;
      sizeStyle.width ??= dimValue;
      sizeStyle.height ??= dimValue;
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden bg-surface-200 dark:bg-surface-700",
          // Shimmer animation
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
          "dark:before:via-white/10",
          variantStyles[variant],
          className
        )}
        style={sizeStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
