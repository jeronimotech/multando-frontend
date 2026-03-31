export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
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

export interface DataTableBaseProps<T> {
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
