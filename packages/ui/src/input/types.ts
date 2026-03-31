export type InputSize = "sm" | "md" | "lg";

export interface InputBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
}

export const inputSizeStyles = {
  sm: "h-8 px-3 text-sm rounded-sm",
  md: "h-10 px-3.5 text-sm rounded-md",
  lg: "h-12 px-4 text-base rounded-lg",
} as const;
