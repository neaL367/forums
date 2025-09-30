"use client";

import { format } from "date-fns";
import { MessageCircle, MessageSquare } from "lucide-react";

import { DataTableColumnHeader } from "@features/administrator/shared/data-table/data-table-column-header";
import { TopicsRowActions } from "@features/administrator/topics/topics-row-actions";

import type { Topic } from "@/types/topic";
import type { ColumnDef } from "@tanstack/react-table";

export const topicsColumns: ColumnDef<Topic>[] = [
  
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="whitespace-normal break-words text-sm w-[300px]">
          {/* {isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
          {isLocked && <Lock className="h-3 w-3 text-red-500" />} */}
          <span className="text-sm font-medium">{getValue() as string}</span>
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
      <div className="text-xs flex gap-2">
        <MessageSquare className="h-4 w-4" />
        {getValue() as string}
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    id: "replies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Replies" />
    ),
    cell: ({ row }) => {
      const repliesCount = row.original.replies?.length || 0;
      return (
        <div className="text-xs flex gap-2">
          <MessageCircle className="h-4 w-4" />
          {repliesCount}
        </div>
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
