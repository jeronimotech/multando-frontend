/**
 * NativeWind preset for React Native / Expo mobile app.
 * NativeWind uses the same Tailwind config format.
 */
declare const preset: {
    theme: {
        extend: {
            colors: {
                brand: {
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
                accent: {
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
                success: {
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
                danger: {
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
                warning: {
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
                surface: {
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
                primary: {
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
                secondary: {
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
            };
            fontFamily: {
                sans: string[];
                display: string[];
                mono: string[];
            };
            borderRadius: {
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
            boxShadow: {
                xs: "0 1px 2px rgba(0, 0, 0, 0.04)";
                sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)";
                DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)";
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)";
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)";
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)";
            };
        };
    };
};

export { preset as default, preset as multandoNativeWindPreset };
