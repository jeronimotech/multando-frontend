export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogBaseProps {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const dialogSizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
} as const;
