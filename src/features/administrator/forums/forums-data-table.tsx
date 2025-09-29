"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@features/administrator/shared/data-table/data-table-pagination";
import { ForumsToolbar } from "@features/administrator/forums/forums-toolbar";
import type { Forums } from "@/types/forums";

interface ForumsDataTableProps {
  data?: Forums[];
  columns?: ColumnDef<Forums>[];
}

export function ForumsDataTable({
  columns = [],
  data = [],
}: ForumsDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subForums,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const searchValue = columnFilters.find((f) => f.id === "title")
      ?.value as string;

    if (searchValue && searchValue.length > 0) {
      const newExpanded: Record<string, boolean> = {};
      const searchLower = searchValue.toLowerCase();

      const checkAndExpandRow = (row: Row<Forums>) => {
        const forum = row.original;

        // Check if any subforum matches
        const hasMatchingSubforum = (
          subForums: Forums[] | undefined
        ): boolean => {
          if (!subForums || subForums.length === 0) return false;

          return subForums.some(
            (sub) =>
              sub.title.toLowerCase().includes(searchLower) ||
              (sub.description?.toLowerCase().includes(searchLower) ?? false) ||
              hasMatchingSubforum(sub.subForums)
          );
        };

        if (hasMatchingSubforum(forum.subForums)) {
          newExpanded[row.id] = true;

          // Also expand all child rows recursively
          const expandChildren = (parentRow: Row<Forums>) => {
            const subRows = parentRow.subRows || [];
            subRows.forEach((subRow) => {
              newExpanded[subRow.id] = true;
              expandChildren(subRow);
            });
          };
          expandChildren(row);
        }
      };

      table.getRowModel().rows.forEach(checkAndExpandRow);
      setExpanded(newExpanded);
    } else {
      setExpanded({});
    }
  }, [columnFilters, table]);

  return (
    <div className="space-y-4">
      <ForumsToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
