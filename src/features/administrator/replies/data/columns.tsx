"use client";

import { format } from "date-fns";
import { FileText } from "lucide-react";

import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import { RepliesRowActions } from "@features/administrator/replies/replies-row-actions";

import type { Replies } from "@/types/replies";
import type { ColumnDef } from "@tanstack/react-table";

export const repliesColumns: ColumnDef<Replies>[] = [
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reply" />
    ),
    cell: ({ getValue }) => (
      <div className="text-sm w-[300px] truncate">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "topicTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ getValue }) => (
      <div className="text-xs flex gap-2">
        <FileText className="h-4 w-4" />
        {getValue() as string}
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RepliesRowActions row={row} />,
    header: () => <span>Actions</span>,
    size: 100,
  },
];
