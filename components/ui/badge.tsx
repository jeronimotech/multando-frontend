"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "success" | "danger" | "warning" | "outline";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-200",
  brand:
    "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  success:
    "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300",
  danger:
    "bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300",
  warning:
    "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300",
  outline:
    "bg-transparent border border-surface-300 text-surface-700 dark:border-surface-600 dark:text-surface-300",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-surface-500",
  brand: "bg-brand-500",
  success: "bg-success-500",
  danger: "bg-danger-500",
  warning: "bg-accent-500",
  outline: "bg-surface-500",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge };
