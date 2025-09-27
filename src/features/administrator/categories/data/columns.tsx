"use client";

import { format } from "date-fns";
import { MessageSquare, Calendar } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { CategoriesRowActions } from "@/features/administrator/categories/categories-row-actions";

import type { Categories } from "@/types/categories";

export const categoriesColumns: ColumnDef<Categories>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className={`flex flex-col gap-0.5`}>
            <div className="font-medium text-card-foreground">
              {row.original.title}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {row.original.description}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "forum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forums" />
    ),
    cell: ({ row }) => {
      const forumCount = row.original.forums?.length || 0;

      return (
        <div className="flex items-center">
          <div className={`flex items-center gap-2`}>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-card-foreground">{forumCount}</span>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="flex items-center">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {date ? format(new Date(date), "MMM dd, yyyy") : "—"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return (
        <div className="flex items-center">
          <span>{date ? format(new Date(date), "MMM dd, yyyy") : "—"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CategoriesRowActions row={row} />
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
