import dynamic from "next/dynamic";
import { useDataTable } from "@/hooks/use-data-table";

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
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTablePaginationProps } from "@features/administrator/shared/data-table/data-table-pagination";

const ForumsToolbar = dynamic(
  () =>
    import("@/features/administrator/forums/data-table/forums-toolbar").then(
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

type ForumsDataTableProps = {
  data?: Forum[];
  columns?: ColumnDef<Forum>[];
}

export function ForumsDataTable({
  data = [],
  columns = [],
}: ForumsDataTableProps) {
  const { table, flexRender } = useDataTable<Forum>({
    data,
    columns,
    enableExpand: true,
    getSubRows: (row) => row.subForums,
  });

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
