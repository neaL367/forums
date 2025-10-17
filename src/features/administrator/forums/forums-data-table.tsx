"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Forum } from "@/types/forum";
import type { DataTablePaginationProps } from "@features/administrator/shared/data-table/data-table-pagination";

interface ForumsDataTableProps {
  data?: Forum[];
  columns?: ColumnDef<Forum>[];
}

const ForumsToolbar = dynamic(
  () =>
    import("@features/administrator/forums/forums-toolbar").then(
      (mod) => mod.ForumsToolbar,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-8 w-full sm:w-[300px]" />,
  },
);

const DataTablePagination = dynamic<DataTablePaginationProps<Forum>>(
  () =>
    import(
      "@features/administrator/shared/data-table/data-table-pagination"
    ).then((mod) => mod.DataTablePagination),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-[300px]" />
      </div>
    ),
  },
);

export function ForumsDataTable({
  data = [],
  columns = [],
}: ForumsDataTableProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    forumCategory: false,
    depth: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const memoColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data,
    columns: memoColumns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, expanded },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    getSubRows: (row) => row.subForums,
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  useEffect(() => {
    const searchValue = columnFilters.find((f) => f.id === "title")?.value;
    const forumValue = columnFilters.find((f) => f.id === "forumCategory")?.value;
    const depthValue = columnFilters.find((f) => f.id === "depth")?.value;

    // Check if depth filter only contains L0
    const isOnlyL0Depth = Array.isArray(depthValue) && 
      depthValue.length > 0 && 
      depthValue.every(d => d === "0");

    // Reset if no filters or only L0 depth filter
    if ((!searchValue && !forumValue && !depthValue) || isOnlyL0Depth) {
      setExpanded({});
      return;
    }

    const newExpanded: Record<string, boolean> = {};

    const hasSearchMatch = (subs?: Forum[]): boolean => {
      if (!searchValue || typeof searchValue !== "string") return false;
      const searchLower = searchValue.toLowerCase();
      return !!subs?.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchLower) ||
          sub.description?.toLowerCase().includes(searchLower) ||
          hasSearchMatch(sub.subForums),
      );
    };

    const hasForumMatch = (subs?: Forum[]): boolean => {
      if (!forumValue || !Array.isArray(forumValue)) return false;
      return !!subs?.some(
        (sub) => forumValue.includes(sub.title) || hasForumMatch(sub.subForums),
      );
    };

    const hasDepthMatch = (subs?: Forum[]): boolean => {
      if (!depthValue || !Array.isArray(depthValue)) return false;
      return !!subs?.some(
        (sub) =>
          depthValue.includes(sub.depth.toString()) ||
          hasDepthMatch(sub.subForums),
      );
    };

    table.getRowModel().rows.forEach((row) => {
      if (
        hasSearchMatch(row.original.subForums) ||
        hasForumMatch(row.original.subForums) ||
        hasDepthMatch(row.original.subForums)
      ) {
        newExpanded[row.id] = true;
      }
    });

    setExpanded(newExpanded);
  }, [columnFilters, table]);

  return (
    <div className="space-y-4">
      <ForumsToolbar table={table} forums={data} />
      <div className="overflow-hidden rounded-md border">
        <Table aria-label="Forums list">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No forums found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}