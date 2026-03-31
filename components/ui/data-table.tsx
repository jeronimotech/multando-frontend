"use client";

import { forwardRef, useState, useCallback, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ColumnDef<T> {
  /** Unique column id */
  id: string;
  /** Header label */
  header: ReactNode;
  /** Accessor: key of T or render function */
  accessor: keyof T | ((row: T) => ReactNode);
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Column header class */
  headerClassName?: string;
  /** Column cell class */
  cellClassName?: string;
}

type SortDirection = "asc" | "desc";

interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Row data */
  data: T[];
  /** Unique key for each row */
  rowKey: keyof T | ((row: T) => string | number);
  /** Enable row selection */
  selectable?: boolean;
  /** Controlled selected row keys */
  selectedKeys?: Set<string | number>;
  /** Selection change handler */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Loading state */
  loading?: boolean;
  /** Number of skeleton rows when loading */
  skeletonRows?: number;
  /** Custom empty state */
  emptyState?: ReactNode;
  /** Pagination */
  page?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  /** External sort handler (server-side sort) */
  onSort?: (columnId: string, direction: SortDirection) => void;
  /** Controlled sort */
  sort?: SortState | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRowKey<T>(row: T, keyDef: keyof T | ((row: T) => string | number)): string | number {
  return typeof keyDef === "function" ? keyDef(row) : (row[keyDef] as unknown as string | number);
}

function getCellValue<T>(row: T, accessor: ColumnDef<T>["accessor"]): ReactNode {
  if (typeof accessor === "function") return accessor(row);
  return row[accessor] as unknown as ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function DataTableInner<T>(
  {
    columns,
    data,
    rowKey,
    selectable = false,
    selectedKeys: controlledSelected,
    onSelectionChange,
    loading = false,
    skeletonRows = 5,
    emptyState,
    page,
    pageSize,
    totalRows,
    onPageChange,
    onSort,
    sort: controlledSort,
    className,
    ...props
  }: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  // Internal selection
  const [internalSelected, setInternalSelected] = useState<Set<string | number>>(new Set());
  const selected = controlledSelected ?? internalSelected;
  const setSelected = useCallback(
    (keys: Set<string | number>) => {
      if (!controlledSelected) setInternalSelected(keys);
      onSelectionChange?.(keys);
    },
    [controlledSelected, onSelectionChange]
  );

  // Internal sort
  const [internalSort, setInternalSort] = useState<SortState | null>(null);
  const sort = controlledSort !== undefined ? controlledSort : internalSort;

  const handleSort = useCallback(
    (columnId: string) => {
      const next: SortState =
        sort?.columnId === columnId && sort.direction === "asc"
          ? { columnId, direction: "desc" }
          : { columnId, direction: "asc" };
      if (controlledSort === undefined) setInternalSort(next);
      onSort?.(next.columnId, next.direction);
    },
    [sort, controlledSort, onSort]
  );

  // Client-side sort when no external handler
  const sortedData = useMemo(() => {
    if (onSort || !sort) return data;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const aVal = typeof col.accessor === "function" ? col.accessor(a) : a[col.accessor];
      const bVal = typeof col.accessor === "function" ? col.accessor(b) : b[col.accessor];
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [data, sort, columns, onSort]);

  // Selection helpers
  const allKeys = useMemo(
    () => sortedData.map((row) => getRowKey(row, rowKey)),
    [sortedData, rowKey]
  );
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = allKeys.some((k) => selected.has(k));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allKeys));
    }
  };

  const toggleRow = (key: string | number) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  // Pagination
  const hasPagination = page !== undefined && pageSize !== undefined && totalRows !== undefined && onPageChange;
  const totalPages = hasPagination ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <div className="overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500 dark:border-surface-600"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-surface-600 dark:text-surface-300",
                    col.sortable && "cursor-pointer select-none hover:text-surface-900 dark:hover:text-white",
                    col.headerClassName
                  )}
                  onClick={() => col.sortable && handleSort(col.id)}
                  aria-sort={
                    sort?.columnId === col.id
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col text-[10px] leading-none" aria-hidden="true">
                        <span
                          className={cn(
                            sort?.columnId === col.id && sort.direction === "asc"
                              ? "text-brand-500"
                              : "text-surface-300 dark:text-surface-600"
                          )}
                        >
                          ▲
                        </span>
                        <span
                          className={cn(
                            sort?.columnId === col.id && sort.direction === "desc"
                              ? "text-brand-500"
                              : "text-surface-300 dark:text-surface-600"
                          )}
                        >
                          ▼
                        </span>
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className="border-b border-surface-100 dark:border-surface-700/50"
                  >
                    {selectable && (
                      <td className="px-3 py-3">
                        <div className="h-4 w-4 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.id} className={cn("px-4 py-3", col.cellClassName)}>
                        <div className="h-4 w-3/4 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : sortedData.length === 0
                ? (
                    <tr>
                      <td
                        colSpan={columns.length + (selectable ? 1 : 0)}
                        className="px-4 py-12 text-center text-surface-500 dark:text-surface-400"
                      >
                        {emptyState ?? "No data available"}
                      </td>
                    </tr>
                  )
                : sortedData.map((row) => {
                    const key = getRowKey(row, rowKey);
                    const isSelected = selected.has(key);
                    return (
                      <tr
                        key={key}
                        className={cn(
                          "border-b border-surface-100 transition-colors dark:border-surface-700/50",
                          isSelected
                            ? "bg-brand-50 dark:bg-brand-900/20"
                            : "hover:bg-surface-50 dark:hover:bg-surface-800/50"
                        )}
                      >
                        {selectable && (
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRow(key)}
                              className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500 dark:border-surface-600"
                              aria-label={`Select row ${key}`}
                            />
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.id}
                            className={cn(
                              "px-4 py-3 text-surface-700 dark:text-surface-200",
                              col.cellClassName
                            )}
                          >
                            {getCellValue(row, col.accessor)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasPagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-surface-600 dark:text-surface-400">
          <span>
            {selectable && selected.size > 0
              ? `${selected.size} of ${totalRows} selected`
              : `${totalRows} row${totalRows === 1 ? "" : "s"} total`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex h-8 items-center rounded-md border border-surface-200 px-3 text-sm transition-colors hover:bg-surface-50 disabled:pointer-events-none disabled:opacity-50 dark:border-surface-700 dark:hover:bg-surface-800"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex h-8 items-center rounded-md border border-surface-200 px-3 text-sm transition-colors hover:bg-surface-50 disabled:pointer-events-none disabled:opacity-50 dark:border-surface-700 dark:hover:bg-surface-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with forwardRef while preserving generics
const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => ReturnType<typeof DataTableInner>;

export { DataTable };
