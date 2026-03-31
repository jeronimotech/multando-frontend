type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
interface ButtonBaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}
declare const buttonVariantStyles: {
    readonly primary: {
        readonly base: "bg-brand-500 text-white";
        readonly hover: "hover:bg-brand-600";
        readonly active: "active:bg-brand-700";
        readonly focus: "focus-visible:ring-brand-500";
    };
    readonly secondary: {
        readonly base: "bg-surface-100 text-surface-900";
        readonly hover: "hover:bg-surface-200";
        readonly active: "active:bg-surface-300";
        readonly focus: "focus-visible:ring-surface-400";
    };
    readonly outline: {
        readonly base: "border border-surface-200 bg-transparent text-surface-900";
        readonly hover: "hover:bg-surface-50";
        readonly active: "active:bg-surface-100";
        readonly focus: "focus-visible:ring-brand-500";
    };
    readonly ghost: {
        readonly base: "bg-transparent text-surface-900";
        readonly hover: "hover:bg-surface-100";
        readonly active: "active:bg-surface-200";
        readonly focus: "focus-visible:ring-brand-500";
    };
    readonly danger: {
        readonly base: "bg-danger-500 text-white";
        readonly hover: "hover:bg-danger-600";
        readonly active: "active:bg-danger-700";
        readonly focus: "focus-visible:ring-danger-500";
    };
    readonly link: {
        readonly base: "bg-transparent text-brand-500 underline-offset-4";
        readonly hover: "hover:underline";
        readonly active: "active:text-brand-700";
        readonly focus: "focus-visible:ring-brand-500";
    };
};
declare const buttonSizeStyles: {
    readonly xs: "h-7 px-2.5 text-xs rounded-sm gap-1";
    readonly sm: "h-8 px-3 text-sm rounded-sm gap-1.5";
    readonly md: "h-10 px-4 text-sm rounded-md gap-2";
    readonly lg: "h-12 px-6 text-base rounded-lg gap-2";
    readonly xl: "h-14 px-8 text-lg rounded-lg gap-2.5";
    readonly icon: "h-10 w-10 rounded-md";
};

type CardVariant = "default" | "interactive" | "glass" | "outline";
interface CardBaseProps {
    variant?: CardVariant;
    padding?: "none" | "sm" | "md" | "lg";
}
declare const cardVariantStyles: {
    readonly default: "bg-white border border-surface-200 shadow-sm dark:bg-surface-800 dark:border-surface-700";
    readonly interactive: "bg-white border border-surface-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 dark:bg-surface-800 dark:border-surface-700 dark:hover:border-brand-500";
    readonly glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg dark:bg-surface-800/80 dark:border-surface-700/50";
    readonly outline: "bg-transparent border-2 border-surface-200 dark:border-surface-700";
};
declare const cardPaddingStyles: {
    readonly none: "p-0";
    readonly sm: "p-4";
    readonly md: "p-6";
    readonly lg: "p-8";
};

type InputSize = "sm" | "md" | "lg";
interface InputBaseProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    size?: InputSize;
}
declare const inputSizeStyles: {
    readonly sm: "h-8 px-3 text-sm rounded-sm";
    readonly md: "h-10 px-3.5 text-sm rounded-md";
    readonly lg: "h-12 px-4 text-base rounded-lg";
};

type BadgeVariant = "default" | "brand" | "success" | "danger" | "warning" | "outline";
type BadgeSize = "sm" | "md" | "lg";
interface BadgeBaseProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
}
declare const badgeVariantStyles: {
    readonly default: "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300";
    readonly brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300";
    readonly success: "bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300";
    readonly danger: "bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-300";
    readonly warning: "bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300";
    readonly outline: "bg-transparent border border-surface-200 text-surface-700 dark:border-surface-600 dark:text-surface-300";
};
declare const badgeSizeStyles: {
    readonly sm: "px-1.5 py-0.5 text-xs";
    readonly md: "px-2.5 py-0.5 text-xs";
    readonly lg: "px-3 py-1 text-sm";
};

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
interface AvatarBaseProps {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
}
declare const avatarSizeStyles: {
    readonly xs: "h-6 w-6 text-xs";
    readonly sm: "h-8 w-8 text-sm";
    readonly md: "h-10 w-10 text-sm";
    readonly lg: "h-12 w-12 text-base";
    readonly xl: "h-16 w-16 text-lg";
    readonly "2xl": "h-20 w-20 text-xl";
};

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
interface DialogBaseProps {
    open: boolean;
    onClose: () => void;
    size?: DialogSize;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}
declare const dialogSizeStyles: {
    readonly sm: "max-w-sm";
    readonly md: "max-w-md";
    readonly lg: "max-w-lg";
    readonly xl: "max-w-xl";
    readonly full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]";
};

type ToastVariant = "default" | "success" | "danger" | "warning" | "info";
type ToastPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
interface ToastBaseProps {
    variant?: ToastVariant;
    title: string;
    description?: string;
    duration?: number;
    dismissible?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}
declare const toastVariantStyles: {
    readonly default: "bg-white border-surface-200 text-surface-900 dark:bg-surface-800 dark:border-surface-700 dark:text-surface-50";
    readonly success: "bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-50";
    readonly danger: "bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-50";
    readonly warning: "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-50";
    readonly info: "bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-50";
};

type ProgressVariant = "linear" | "circular";
interface ProgressBaseProps {
    value: number;
    max?: number;
    variant?: ProgressVariant;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    color?: "brand" | "success" | "danger" | "warning" | "accent";
}
interface StepperBaseProps {
    steps: Array<{
        label: string;
        description?: string;
    }>;
    currentStep: number;
    orientation?: "horizontal" | "vertical";
}

type TabsVariant = "default" | "pills" | "underline";
interface TabsBaseProps {
    variant?: TabsVariant;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}
interface TabItem {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    badge?: string | number;
}

type SortDirection = "asc" | "desc" | null;
interface ColumnDef<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    accessorFn?: (row: T) => unknown;
    cell?: (value: unknown, row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
}
interface DataTableBaseProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    sortBy?: string;
    sortDirection?: SortDirection;
    onSort?: (columnId: string, direction: SortDirection) => void;
    selectable?: boolean;
    selectedRows?: Set<string>;
    onSelectionChange?: (selectedRows: Set<string>) => void;
    rowKey: keyof T | ((row: T) => string);
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
        onPageSizeChange?: (pageSize: number) => void;
    };
}

export { type AvatarBaseProps, type AvatarSize, type BadgeBaseProps, type BadgeSize, type BadgeVariant, type ButtonBaseProps, type ButtonSize, type ButtonVariant, type CardBaseProps, type CardVariant, type ColumnDef, type DataTableBaseProps, type DialogBaseProps, type DialogSize, type InputBaseProps, type InputSize, type ProgressBaseProps, type ProgressVariant, type SortDirection, type StepperBaseProps, type TabItem, type TabsBaseProps, type TabsVariant, type ToastBaseProps, type ToastPosition, type ToastVariant, avatarSizeStyles, badgeSizeStyles, badgeVariantStyles, buttonSizeStyles, buttonVariantStyles, cardPaddingStyles, cardVariantStyles, dialogSizeStyles, inputSizeStyles, toastVariantStyles };
