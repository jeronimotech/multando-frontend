/**
 * Multando Design System — Shadow Tokens
 */

export const shadows = {
  xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
  sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  DEFAULT:
    "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
  none: "0 0 #0000",
  glow: {
    brand: "0 0 20px rgba(59, 94, 239, 0.15)",
    success: "0 0 20px rgba(16, 185, 129, 0.15)",
    danger: "0 0 20px rgba(239, 68, 68, 0.15)",
    accent: "0 0 20px rgba(245, 158, 11, 0.15)",
  },
} as const;
