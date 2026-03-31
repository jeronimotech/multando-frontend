// src/button/types.ts
var buttonVariantStyles = {
  primary: {
    base: "bg-brand-500 text-white",
    hover: "hover:bg-brand-600",
    active: "active:bg-brand-700",
    focus: "focus-visible:ring-brand-500"
  },
  secondary: {
    base: "bg-surface-100 text-surface-900",
    hover: "hover:bg-surface-200",
    active: "active:bg-surface-300",
    focus: "focus-visible:ring-surface-400"
  },
  outline: {
    base: "border border-surface-200 bg-transparent text-surface-900",
    hover: "hover:bg-surface-50",
    active: "active:bg-surface-100",
    focus: "focus-visible:ring-brand-500"
  },
  ghost: {
    base: "bg-transparent text-surface-900",
    hover: "hover:bg-surface-100",
    active: "active:bg-surface-200",
    focus: "focus-visible:ring-brand-500"
  },
  danger: {
    base: "bg-danger-500 text-white",
    hover: "hover:bg-danger-600",
    active: "active:bg-danger-700",
    focus: "focus-visible:ring-danger-500"
  },
  link: {
    base: "bg-transparent text-brand-500 underline-offset-4",
    hover: "hover:underline",
    active: "active:text-brand-700",
    focus: "focus-visible:ring-brand-500"
  }
};
var buttonSizeStyles = {
  xs: "h-7 px-2.5 text-xs rounded-sm gap-1",
  sm: "h-8 px-3 text-sm rounded-sm gap-1.5",
  md: "h-10 px-4 text-sm rounded-md gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  xl: "h-14 px-8 text-lg rounded-lg gap-2.5",
  icon: "h-10 w-10 rounded-md"
};

// src/card/types.ts
var cardVariantStyles = {
  default: "bg-white border border-surface-200 shadow-sm dark:bg-surface-800 dark:border-surface-700",
  interactive: "bg-white border border-surface-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 dark:bg-surface-800 dark:border-surface-700 dark:hover:border-brand-500",
  glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg dark:bg-surface-800/80 dark:border-surface-700/50",
  outline: "bg-transparent border-2 border-surface-200 dark:border-surface-700"
};
var cardPaddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

// src/input/types.ts
var inputSizeStyles = {
  sm: "h-8 px-3 text-sm rounded-sm",
  md: "h-10 px-3.5 text-sm rounded-md",
  lg: "h-12 px-4 text-base rounded-lg"
};

// src/badge/types.ts
var badgeVariantStyles = {
  default: "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  success: "bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300",
  outline: "bg-transparent border border-surface-200 text-surface-700 dark:border-surface-600 dark:text-surface-300"
};
var badgeSizeStyles = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm"
};

// src/avatar/types.ts
var avatarSizeStyles = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl"
};

// src/dialog/types.ts
var dialogSizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
};

// src/toast/types.ts
var toastVariantStyles = {
  default: "bg-white border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50",
  success: "bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-50",
  danger: "bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-50",
  warning: "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-50",
  info: "bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-50"
};
export {
  avatarSizeStyles,
  badgeSizeStyles,
  badgeVariantStyles,
  buttonSizeStyles,
  buttonVariantStyles,
  cardPaddingStyles,
  cardVariantStyles,
  dialogSizeStyles,
  inputSizeStyles,
  toastVariantStyles
};
