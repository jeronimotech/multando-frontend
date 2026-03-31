export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarBaseProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

export const avatarSizeStyles = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
} as const;
