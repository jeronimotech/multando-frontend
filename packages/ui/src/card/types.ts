export type CardVariant = "default" | "interactive" | "glass" | "outline";

export interface CardBaseProps {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

export const cardVariantStyles = {
  default: "bg-white border border-surface-200 shadow-sm dark:bg-surface-800 dark:border-surface-700",
  interactive:
    "bg-white border border-surface-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 dark:bg-surface-800 dark:border-surface-700 dark:hover:border-brand-500",
  glass:
    "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg dark:bg-surface-800/80 dark:border-surface-700/50",
  outline:
    "bg-transparent border-2 border-surface-200 dark:border-surface-700",
} as const;

export const cardPaddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;
