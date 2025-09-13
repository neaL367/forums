"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown, Circle } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { CategoriesRowActions } from "@/features/administrator/categories/categories-row-actions";
import type { Categories } from "@/types/categories";
import { Badge } from "@/components/ui/badge";

export const categoriesColumns: ColumnDef<Categories>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2 px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className=""
        />
        {/* <button
          onClick={table.getToggleAllRowsExpandedHandler()}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label={table.getIsAllRowsExpanded() ? "Collapse all" : "Expand all"}
        >
          {table.getIsAllRowsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button> */}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 gap-2 flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div
        className={`px-2 ${row.depth > 0 ? "text-sm text-muted-foreground" : "text-base font-medium"}`}
      >
        {row.original.id}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row, getValue }) => {
      const isSubRow = row.depth > 0;
      return (
        <div className="px-2">
          <div className="flex items-center gap-2">
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <Circle className="h-2 w-2 fill-current ring-2 ring-white text-background rounded-full" />
            )}
            <span
              className={`${isSubRow ? "text-sm text-muted-foreground" : "text-base font-medium"}`}
            >
              {getValue() as string}
            </span>
            {isSubRow && <Badge variant="secondary">Forum</Badge>}
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
      <div
        className={`px-2 ${row.depth > 0 ? "text-sm text-muted-foreground" : "text-base"}`}
      >
        {getValue() as string}
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
        <div
          className={`px-2 ${row.depth > 0 ? "text-sm text-muted-foreground" : "text-base"}`}
        >
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row, getValue }) => {
      const date = getValue() as string;
      return (
        <div
          className={`px-2 ${row.depth > 0 ? "text-sm text-muted-foreground" : "text-base"}`}
        >
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="px-2">
        <CategoriesRowActions row={row} />
      </div>
    ),
    header: () => <span className="px-2">Actions</span>,
  },
];
