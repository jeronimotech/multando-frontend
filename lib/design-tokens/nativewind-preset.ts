import { colors } from "./colors";
import { fontFamily } from "./typography";
import { borderRadius } from "./spacing";
import { shadows } from "./shadows";

/**
 * NativeWind preset for React Native / Expo mobile app.
 * NativeWind uses the same Tailwind config format.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        accent: colors.accent,
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
        surface: colors.surface,
        primary: colors.brand,
        secondary: colors.accent,
      },
      fontFamily: {
        sans: fontFamily.sans as unknown as string[],
        display: fontFamily.display as unknown as string[],
        mono: fontFamily.mono as unknown as string[],
      },
      borderRadius,
      boxShadow: {
        xs: shadows.xs,
        sm: shadows.sm,
        DEFAULT: shadows.DEFAULT,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
      },
    },
  },
};

export default preset;
export { preset as multandoNativeWindPreset };
