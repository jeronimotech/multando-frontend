export type ProgressVariant = "linear" | "circular";

export interface ProgressBaseProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  color?: "brand" | "success" | "danger" | "warning" | "accent";
}

export interface StepperBaseProps {
  steps: Array<{
    label: string;
    description?: string;
  }>;
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}
