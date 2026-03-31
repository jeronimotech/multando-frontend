export type ToastVariant = "default" | "success" | "danger" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastBaseProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toastVariantStyles = {
  default: "bg-white border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50",
  success: "bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-50",
  danger: "bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-50",
  warning: "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-50",
  info: "bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-50",
} as const;
