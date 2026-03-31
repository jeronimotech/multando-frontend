"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/tailwind-preset.ts
var tailwind_preset_exports = {};
__export(tailwind_preset_exports, {
  default: () => tailwind_preset_default,
  multandoPreset: () => preset
});
module.exports = __toCommonJS(tailwind_preset_exports);

// src/colors.ts
var colors = {
  brand: {
    50: "#eef4ff",
    100: "#d9e5ff",
    200: "#bccefd",
    300: "#8eabfb",
    400: "#5b80f5",
    500: "#3b5eef",
    600: "#2542e4",
    700: "#1d33d1",
    800: "#1e2da9",
    900: "#1e2b85",
    950: "#161b52",
    DEFAULT: "#3b5eef"
  },
  accent: {
    50: "#fff8eb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbd23",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
    DEFAULT: "#f59e0b"
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
    DEFAULT: "#10b981"
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
    DEFAULT: "#ef4444"
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
    DEFAULT: "#f59e0b"
  },
  surface: {
    0: "#ffffff",
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  }
};
var semanticColors = {
  light: {
    background: colors.surface[0],
    foreground: colors.surface[900],
    muted: colors.surface[50],
    mutedForeground: colors.surface[500],
    border: colors.surface[200],
    ring: colors.brand[500],
    card: colors.surface[0],
    cardForeground: colors.surface[900],
    popover: colors.surface[0],
    popoverForeground: colors.surface[900],
    primary: colors.brand.DEFAULT,
    primaryForeground: "#ffffff",
    secondary: colors.surface[100],
    secondaryForeground: colors.surface[900],
    accent: colors.accent.DEFAULT,
    accentForeground: "#ffffff",
    destructive: colors.danger.DEFAULT,
    destructiveForeground: "#ffffff",
    input: colors.surface[200],
    placeholder: colors.surface[400]
  },
  dark: {
    background: colors.surface[900],
    foreground: colors.surface[50],
    muted: colors.surface[800],
    mutedForeground: colors.surface[400],
    border: colors.surface[700],
    ring: colors.brand[400],
    card: colors.surface[800],
    cardForeground: colors.surface[50],
    popover: colors.surface[800],
    popoverForeground: colors.surface[50],
    primary: colors.brand[400],
    primaryForeground: colors.surface[900],
    secondary: colors.surface[700],
    secondaryForeground: colors.surface[50],
    accent: colors.accent[400],
    accentForeground: colors.surface[900],
    destructive: colors.danger[400],
    destructiveForeground: colors.surface[50],
    input: colors.surface[700],
    placeholder: colors.surface[500]
  }
};

// src/typography.ts
var fontFamily = {
  sans: ['"Inter Variable"', "Inter", "system-ui", "-apple-system", "sans-serif"],
  display: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
  mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"]
};
var fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }],
  sm: ["0.875rem", { lineHeight: "1.25rem" }],
  base: ["1rem", { lineHeight: "1.5rem" }],
  lg: ["1.125rem", { lineHeight: "1.75rem" }],
  xl: ["1.25rem", { lineHeight: "1.75rem" }],
  "2xl": ["1.5rem", { lineHeight: "2rem" }],
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  "5xl": ["3rem", { lineHeight: "1.1" }],
  "6xl": ["3.75rem", { lineHeight: "1.1" }]
};

// src/spacing.ts
var borderRadius = {
  none: "0px",
  sm: "0.375rem",
  DEFAULT: "0.625rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px"
};

// src/shadows.ts
var shadows = {
  xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
  sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
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
    accent: "0 0 20px rgba(245, 158, 11, 0.15)"
  }
};

// src/tailwind-preset.ts
var preset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        accent: colors.accent,
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
        surface: colors.surface,
        // Semantic aliases for common usage
        primary: colors.brand,
        secondary: colors.accent
      },
      fontFamily: {
        sans: fontFamily.sans,
        display: fontFamily.display,
        mono: fontFamily.mono
      },
      fontSize,
      borderRadius,
      boxShadow: {
        xs: shadows.xs,
        sm: shadows.sm,
        DEFAULT: shadows.DEFAULT,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        "2xl": shadows["2xl"],
        inner: shadows.inner,
        none: shadows.none,
        "glow-brand": shadows.glow.brand,
        "glow-success": shadows.glow.success,
        "glow-danger": shadows.glow.danger,
        "glow-accent": shadows.glow.accent
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-out": "fadeOut 0.3s ease-in",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-out-right": "slideOutRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  }
};
var tailwind_preset_default = preset;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  multandoPreset
});
