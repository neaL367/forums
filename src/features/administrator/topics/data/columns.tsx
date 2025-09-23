"use client";

import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
// import { Pin, Lock } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import { TopicsRowActions } from "@features/administrator/topics/topics-row-actions";

import type { Topics } from "@/types/topics";

export const topicsColumns: ColumnDef<Topics>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="flex items-center gap-2 min-h-[40px]">
          {/* {isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
          {isLocked && <Lock className="h-3 w-3 text-red-500" />} */}
          <span className="text-base font-medium">{getValue() as string}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "forumTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forum" />
    ),
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-xs">
        {getValue() as string}
      </Badge>
    ),
  },
  {
    id: "replies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Replies" />
    ),
    cell: ({ row }) => {
      const repliesCount = row.original.replies?.length || 0;
      return (
        <Badge variant="secondary" className="text-xs">
          {repliesCount}
        </Badge>
      );
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
    cell: ({ row }) => <TopicsRowActions row={row} />,
    header: () => <span>Actions</span>,
    size: 100,
  },
];
