/**
 * Multando Design System — Color Tokens
 *
 * Brand blue shifted to #3b5eef for a deeper, more distinctive civic identity.
 * Success shifted to emerald (#10b981) for a modern feel.
 */
declare const colors: {
    readonly brand: {
        readonly 50: "#eef4ff";
        readonly 100: "#d9e5ff";
        readonly 200: "#bccefd";
        readonly 300: "#8eabfb";
        readonly 400: "#5b80f5";
        readonly 500: "#3b5eef";
        readonly 600: "#2542e4";
        readonly 700: "#1d33d1";
        readonly 800: "#1e2da9";
        readonly 900: "#1e2b85";
        readonly 950: "#161b52";
        readonly DEFAULT: "#3b5eef";
    };
    readonly accent: {
        readonly 50: "#fff8eb";
        readonly 100: "#fef3c7";
        readonly 200: "#fde68a";
        readonly 300: "#fcd34d";
        readonly 400: "#fbbd23";
        readonly 500: "#f59e0b";
        readonly 600: "#d97706";
        readonly 700: "#b45309";
        readonly 800: "#92400e";
        readonly 900: "#78350f";
        readonly 950: "#451a03";
        readonly DEFAULT: "#f59e0b";
    };
    readonly success: {
        readonly 50: "#ecfdf5";
        readonly 100: "#d1fae5";
        readonly 200: "#a7f3d0";
        readonly 300: "#6ee7b7";
        readonly 400: "#34d399";
        readonly 500: "#10b981";
        readonly 600: "#059669";
        readonly 700: "#047857";
        readonly 800: "#065f46";
        readonly 900: "#064e3b";
        readonly 950: "#022c22";
        readonly DEFAULT: "#10b981";
    };
    readonly danger: {
        readonly 50: "#fef2f2";
        readonly 100: "#fee2e2";
        readonly 200: "#fecaca";
        readonly 300: "#fca5a5";
        readonly 400: "#f87171";
        readonly 500: "#ef4444";
        readonly 600: "#dc2626";
        readonly 700: "#b91c1c";
        readonly 800: "#991b1b";
        readonly 900: "#7f1d1d";
        readonly 950: "#450a0a";
        readonly DEFAULT: "#ef4444";
    };
    readonly warning: {
        readonly 50: "#fffbeb";
        readonly 100: "#fef3c7";
        readonly 200: "#fde68a";
        readonly 300: "#fcd34d";
        readonly 400: "#fbbf24";
        readonly 500: "#f59e0b";
        readonly 600: "#d97706";
        readonly 700: "#b45309";
        readonly 800: "#92400e";
        readonly 900: "#78350f";
        readonly 950: "#451a03";
        readonly DEFAULT: "#f59e0b";
    };
    readonly surface: {
        readonly 0: "#ffffff";
        readonly 50: "#f8fafc";
        readonly 100: "#f1f5f9";
        readonly 200: "#e2e8f0";
        readonly 300: "#cbd5e1";
        readonly 400: "#94a3b8";
        readonly 500: "#64748b";
        readonly 600: "#475569";
        readonly 700: "#334155";
        readonly 800: "#1e293b";
        readonly 900: "#0f172a";
        readonly 950: "#020617";
    };
};
declare const semanticColors: {
    readonly light: {
        readonly background: "#ffffff";
        readonly foreground: "#0f172a";
        readonly muted: "#f8fafc";
        readonly mutedForeground: "#64748b";
        readonly border: "#e2e8f0";
        readonly ring: "#3b5eef";
        readonly card: "#ffffff";
        readonly cardForeground: "#0f172a";
        readonly popover: "#ffffff";
        readonly popoverForeground: "#0f172a";
        readonly primary: "#3b5eef";
        readonly primaryForeground: "#ffffff";
        readonly secondary: "#f1f5f9";
        readonly secondaryForeground: "#0f172a";
        readonly accent: "#f59e0b";
        readonly accentForeground: "#ffffff";
        readonly destructive: "#ef4444";
        readonly destructiveForeground: "#ffffff";
        readonly input: "#e2e8f0";
        readonly placeholder: "#94a3b8";
    };
    readonly dark: {
        readonly background: "#0f172a";
        readonly foreground: "#f8fafc";
        readonly muted: "#1e293b";
        readonly mutedForeground: "#94a3b8";
        readonly border: "#334155";
        readonly ring: "#5b80f5";
        readonly card: "#1e293b";
        readonly cardForeground: "#f8fafc";
        readonly popover: "#1e293b";
        readonly popoverForeground: "#f8fafc";
        readonly primary: "#5b80f5";
        readonly primaryForeground: "#0f172a";
        readonly secondary: "#334155";
        readonly secondaryForeground: "#f8fafc";
        readonly accent: "#fbbd23";
        readonly accentForeground: "#0f172a";
        readonly destructive: "#f87171";
        readonly destructiveForeground: "#f8fafc";
        readonly input: "#334155";
        readonly placeholder: "#64748b";
    };
};
type ColorScale = typeof colors.brand;
type SemanticColorMode = typeof semanticColors.light;

/**
 * Multando Design System — Typography Tokens
 */
declare const fontFamily: {
    readonly sans: readonly ["\"Inter Variable\"", "Inter", "system-ui", "-apple-system", "sans-serif"];
    readonly display: readonly ["\"Inter Variable\"", "Inter", "system-ui", "sans-serif"];
    readonly mono: readonly ["\"JetBrains Mono\"", "ui-monospace", "SFMono-Regular", "monospace"];
};
declare const fontSize: {
    readonly xs: readonly ["0.75rem", {
        readonly lineHeight: "1rem";
    }];
    readonly sm: readonly ["0.875rem", {
        readonly lineHeight: "1.25rem";
    }];
    readonly base: readonly ["1rem", {
        readonly lineHeight: "1.5rem";
    }];
    readonly lg: readonly ["1.125rem", {
        readonly lineHeight: "1.75rem";
    }];
    readonly xl: readonly ["1.25rem", {
        readonly lineHeight: "1.75rem";
    }];
    readonly "2xl": readonly ["1.5rem", {
        readonly lineHeight: "2rem";
    }];
    readonly "3xl": readonly ["1.875rem", {
        readonly lineHeight: "2.25rem";
    }];
    readonly "4xl": readonly ["2.25rem", {
        readonly lineHeight: "2.5rem";
    }];
    readonly "5xl": readonly ["3rem", {
        readonly lineHeight: "1.1";
    }];
    readonly "6xl": readonly ["3.75rem", {
        readonly lineHeight: "1.1";
    }];
};
declare const fontWeight: {
    readonly normal: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
    readonly extrabold: "800";
};
declare const letterSpacing: {
    readonly tighter: "-0.05em";
    readonly tight: "-0.025em";
    readonly normal: "0em";
    readonly wide: "0.025em";
};

/**
 * Multando Design System — Spacing & Border Radius Tokens
 */
declare const spacing: {
    readonly px: "1px";
    readonly 0: "0px";
    readonly 0.5: "0.125rem";
    readonly 1: "0.25rem";
    readonly 1.5: "0.375rem";
    readonly 2: "0.5rem";
    readonly 2.5: "0.625rem";
    readonly 3: "0.75rem";
    readonly 3.5: "0.875rem";
    readonly 4: "1rem";
    readonly 5: "1.25rem";
    readonly 6: "1.5rem";
    readonly 7: "1.75rem";
    readonly 8: "2rem";
    readonly 9: "2.25rem";
    readonly 10: "2.5rem";
    readonly 11: "2.75rem";
    readonly 12: "3rem";
    readonly 14: "3.5rem";
    readonly 16: "4rem";
    readonly 20: "5rem";
    readonly 24: "6rem";
    readonly 28: "7rem";
    readonly 32: "8rem";
    readonly 36: "9rem";
    readonly 40: "10rem";
    readonly 44: "11rem";
    readonly 48: "12rem";
    readonly 52: "13rem";
    readonly 56: "14rem";
    readonly 60: "15rem";
    readonly 64: "16rem";
};
declare const borderRadius: {
    readonly none: "0px";
    readonly sm: "0.375rem";
    readonly DEFAULT: "0.625rem";
    readonly md: "0.625rem";
    readonly lg: "0.875rem";
    readonly xl: "1.25rem";
    readonly "2xl": "1.5rem";
    readonly "3xl": "2rem";
    readonly full: "9999px";
};

/**
 * Multando Design System — Shadow Tokens
 */
declare const shadows: {
    readonly xs: "0 1px 2px rgba(0, 0, 0, 0.04)";
    readonly sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)";
    readonly DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)";
    readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)";
    readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)";
    readonly xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)";
    readonly "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.2)";
    readonly inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)";
    readonly none: "0 0 #0000";
    readonly glow: {
        readonly brand: "0 0 20px rgba(59, 94, 239, 0.15)";
        readonly success: "0 0 20px rgba(16, 185, 129, 0.15)";
        readonly danger: "0 0 20px rgba(239, 68, 68, 0.15)";
        readonly accent: "0 0 20px rgba(245, 158, 11, 0.15)";
    };
};

export { type ColorScale, type SemanticColorMode, borderRadius, colors, fontFamily, fontSize, fontWeight, letterSpacing, semanticColors, shadows, spacing };
