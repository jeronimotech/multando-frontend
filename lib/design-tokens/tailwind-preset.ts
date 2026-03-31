import type { Config } from "tailwindcss";
import { colors } from "./colors";
import { fontFamily, fontSize } from "./typography";
import { borderRadius } from "./spacing";
import { shadows } from "./shadows";

const preset: Partial<Config> = {
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
        secondary: colors.accent,
      },
      fontFamily: {
        sans: fontFamily.sans as unknown as string[],
        display: fontFamily.display as unknown as string[],
        mono: fontFamily.mono as unknown as string[],
      },
      fontSize: fontSize as unknown as Record<string, [string, { lineHeight: string }]>,
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
        "glow-accent": shadows.glow.accent,
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
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
};

export default preset;
export { preset as multandoPreset };
