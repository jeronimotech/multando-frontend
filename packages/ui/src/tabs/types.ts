export type TabsVariant = "default" | "pills" | "underline";

export interface TabsBaseProps {
  variant?: TabsVariant;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}
