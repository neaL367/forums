"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown, MessageSquare } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { ForumsRowActions } from "@/features/administrator/forums/forums-row-actions";

import type { Forums } from "@/types/forums";
import { cn } from "@/lib/utils";

export const forumsColumns: ColumnDef<Forums>[] = [
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
        <div className="flex items-center gap-2">
          {/* Expand/Collapse Button */}
          <div className="w-6 h-6 flex items-center justify-center">
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-muted rounded transition-colors flex items-center justify-center"
                aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6" />
            )}
          </div>

          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 80,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center min-h-[40px]">
        <span
          className={cn(
            row.depth > 0
              ? "text-sm text-muted-foreground ml-4"
              : "text-sm font-mono text-muted-foreground"
          )}
        >
          {row.original.id}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forum" />
    ),
    cell: ({ row, getValue }) => {
      const isSubForum = row.depth > 0;
      const forum = row.original;
      const topicsCount = forum.topics?.length ?? 0;

      return (
        <div className="flex items-center min-h-[40px]">
          <div
            className={`flex items-center gap-2 ${isSubForum ? "ml-4" : ""}`}
          >
            <div className="flex flex-col gap-1">
              <span
                className={`${
                  isSubForum
                    ? "text-sm text-muted-foreground"
                    : "text-base font-medium"
                }`}
              >
                {getValue() as string}
              </span>
              {topicsCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {topicsCount} topic{topicsCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
            {isSubForum && (
              <Badge variant="outline" className="text-xs">
                Sub-forum
              </Badge>
            )}
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row, getValue }) => (
      <div className="flex items-center min-h-[40px]">
        <span
          className={cn(
            `max-w-[300px] truncate`,
            row.depth > 0 ? "text-sm text-muted-foreground ml-4" : "text-base"
          )}
        >
          {getValue() as string}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "categoryTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center min-h-[40px]">
        <Badge variant="secondary" className={`${row.depth > 0 ? "ml-4" : ""}`}>
          {row.original.categoryTitle}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    accessorKey: "parentForumTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Forum" />
    ),
    cell: ({ getValue, row }) => (
      <div className="flex items-center min-h-[40px]">
        <Badge variant="secondary" className={`${row.depth > 0 ? "ml-4" : ""}`}>
          {getValue() ? (getValue() as string) : "—"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row, getValue }) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center min-h-[40px]">
          <span
            className={`${
              row.depth > 0 ? "text-sm text-muted-foreground ml-4" : "text-sm"
            }`}
          >
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
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
      <div className="flex items-center justify-center min-h-[40px]">
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
