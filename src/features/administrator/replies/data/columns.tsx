"use client";

import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import { RepliesRowActions } from "@features/administrator/replies/replies-row-actions";

import type { Replies } from "@/types/replies";

export const repliesColumns: ColumnDef<Replies>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-start w-full min-w-[80px]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5" />
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start w-full min-w-[80px] py-2">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5" />
          <Checkbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm font-mono text-muted-foreground">
        {getValue() as string}
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 80,
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "topicTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-xs">
        {getValue() as string}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    accessorKey: "parentReplyContent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Reply" />
    ),
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground italic">
        {getValue() ? (getValue() as string) : "—"}
      </span>
    ),
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
