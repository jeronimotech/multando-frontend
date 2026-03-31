export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const buttonVariantStyles = {
  primary: {
    base: "bg-brand-500 text-white",
    hover: "hover:bg-brand-600",
    active: "active:bg-brand-700",
    focus: "focus-visible:ring-brand-500",
  },
  secondary: {
    base: "bg-surface-100 text-surface-900",
    hover: "hover:bg-surface-200",
    active: "active:bg-surface-300",
    focus: "focus-visible:ring-surface-400",
  },
  outline: {
    base: "border border-surface-200 bg-transparent text-surface-900",
    hover: "hover:bg-surface-50",
    active: "active:bg-surface-100",
    focus: "focus-visible:ring-brand-500",
  },
  ghost: {
    base: "bg-transparent text-surface-900",
    hover: "hover:bg-surface-100",
    active: "active:bg-surface-200",
    focus: "focus-visible:ring-brand-500",
  },
  danger: {
    base: "bg-danger-500 text-white",
    hover: "hover:bg-danger-600",
    active: "active:bg-danger-700",
    focus: "focus-visible:ring-danger-500",
  },
  link: {
    base: "bg-transparent text-brand-500 underline-offset-4",
    hover: "hover:underline",
    active: "active:text-brand-700",
    focus: "focus-visible:ring-brand-500",
  },
} as const;

export const buttonSizeStyles = {
  xs: "h-7 px-2.5 text-xs rounded-sm gap-1",
  sm: "h-8 px-3 text-sm rounded-sm gap-1.5",
  md: "h-10 px-4 text-sm rounded-md gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  xl: "h-14 px-8 text-lg rounded-lg gap-2.5",
  icon: "h-10 w-10 rounded-md",
} as const;
