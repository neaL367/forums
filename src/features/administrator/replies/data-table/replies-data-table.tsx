import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import { useDataTable } from "@/hooks/use-data-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ColumnDef } from "@tanstack/react-table";
import type { Reply } from "@/types/reply";

const RepliesToolbar = dynamic(
  () =>
    import("@features/administrator/replies/data-table/replies-toolbar").then(
      (mod) => ({ default: mod.RepliesToolbar })
    ),
  {
    ssr: false,
    loading: () => <div className="h-10 w-full" />,
  }
);

const DataTablePagination = dynamic(
  () =>
    import("@features/administrator/shared/data-table/data-table-pagination").then(
      (mod) => mod.DataTablePagination as typeof mod.DataTablePagination
    ),
  {
    ssr: false,
    loading: () => <div className="h-8 w-full" />,
  }
) as <TData>(props: { table: import("@tanstack/react-table").Table<TData> }) => ReactElement;

interface DataTableProps {
  data?: Reply[];
  columns?: ColumnDef<Reply>[];
}

export function RepliesDataTable({ columns = [], data = [] }: DataTableProps) {
  const { table, flexRender } = useDataTable<Reply>({
    data,
    columns,
  });

  return (
    <div className="space-y-4">
      <RepliesToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
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
                  No results.
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
