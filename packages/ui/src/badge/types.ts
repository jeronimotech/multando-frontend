export type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "danger"
  | "warning"
  | "outline";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeBaseProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const badgeVariantStyles = {
  default: "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  success: "bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300",
  outline: "bg-transparent border border-surface-200 text-surface-700 dark:border-surface-600 dark:text-surface-300",
} as const;

export const badgeSizeStyles = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
} as const;
