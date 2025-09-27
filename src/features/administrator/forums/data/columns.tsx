"use client";

import { format } from "date-fns";
import { Calendar, FolderTree, ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { ForumsRowActions } from "@/features/administrator/forums/forums-row-actions";

import type { Forums } from "@/types/forums";

export const forumsColumns: ColumnDef<Forums>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forum" />
    ),
    cell: ({ row }) => {
      const forum = row.original;

      return (
        <div className="flex flex-col gap-1 ">
          {/* Forum hierarchy */}
          {forum.subForums && forum.parentForumId ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{forum.parentForumTitle}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-card-foreground font-medium">
                {forum.title}
              </span>
            </div>
          ) : (
            <span className="text-card-foreground font-medium">
              {forum.title}
            </span>
          )}

          {/* Description */}
          {forum.description && (
            <div className="text-muted-foreground text-sm w-[500px] truncate">
              {forum.description}
            </div>
          )}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "categoryTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FolderTree className="h-4 w-4 text-muted-foreground" />
        {row.original.categoryTitle}
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    accessorKey: "topicCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      const topicCount = row.original.topics?.length || 0;
      return <div className="flex items-center gap-2">{topicCount}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
    size: 120,
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
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ForumsRowActions row={row} />
      </div>
    ),
    header: () => (
      <div className="flex items-center justify-center">
        <span>Actions</span>
      </div>
    ),
    size: 100,
  },
];
