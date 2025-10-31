import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
} from "@tanstack/react-table";
import { useState } from "react";

export type UseDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableExpand?: boolean;
  getSubRows?: (row: TData) => TData[] | undefined;
}

export function useDataTable<TData>({
  data,
  columns,
  enableExpand = false,
  getSubRows,
}: UseDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      ...(enableExpand ? { expanded } : {}),
    },

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableExpand ? { onExpandedChange: setExpanded } : {}),

    enableRowSelection: true,
    ...(enableExpand && getSubRows ? { getSubRows } : {}),
    autoResetExpanded: false,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(enableExpand ? { getExpandedRowModel: getExpandedRowModel() } : {}),
  });

  return { table, flexRender };
}
