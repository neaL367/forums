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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Forum } from "@/types/forum";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePaginationProps } from "@features/administrator/shared/data-table/data-table-pagination";

const ForumsToolbar = dynamic(
  () =>
    import("@features/administrator/forums/forums-toolbar").then(
      (mod) => mod.ForumsToolbar
    ),
  {
    loading: () => (
      <Skeleton className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]" />
    ),
    ssr: false,
  }
);

const DataTablePagination = dynamic<DataTablePaginationProps<Forum>>(
  () =>
    import(
      "@features/administrator/shared/data-table/data-table-pagination"
    ).then((mod) => mod.DataTablePagination),
  {
    loading: () => (
      <Skeleton className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]" />
    ),
    ssr: false,
  }
);

interface ForumsDataTableProps {
  data?: Forum[];
  columns?: ColumnDef<Forum>[];
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

      const checkAndExpandRow = (row: Row<Forum>) => {
        const forum = row.original;

        // Check if any subforum matches
        const hasMatchingSubforum = (
          subForums: Forum[] | undefined
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

          // expand all child rows recursively
          const expandChildren = (parentRow: Row<Forum>) => {
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
      <ForumsToolbar table={table} allForums={data} />
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
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "expander" ? "pl-6" : "px-6"
                      }
                    >
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
