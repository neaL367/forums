"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { CategoriesRowActions } from "@/features/administrator/categories/categories-row-actions";
import type { Categories } from "@/types/categories";
import { Badge } from "@/components/ui/badge";

export const categoriesColumns: ColumnDef<Categories>[] = [
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
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
          
          {/* Checkbox */}
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
          className={`${
            row.depth > 0 
              ? "text-sm text-muted-foreground ml-4" 
              : "text-base font-medium"
          }`}
        >
          {row.original.id}
        </span>
      </div>
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
    cell: ({ row, getValue }) => {
      const isSubRow = row.depth > 0;
      return (
        <div className="flex items-center min-h-[40px]">
          <div className={`flex items-center gap-2 ${isSubRow ? "ml-4" : ""}`}>
            <span
              className={`${
                isSubRow 
                  ? "text-sm text-muted-foreground" 
                  : "text-base font-medium"
              }`}
            >
              {getValue() as string}
            </span>
            {isSubRow && (
              <Badge variant="secondary" className="text-xs">
                Forum
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
          className={`${
            row.depth > 0 
              ? "text-sm text-muted-foreground ml-4" 
              : "text-base"
          }`}
        >
          {getValue() as string}
        </span>
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
              row.depth > 0 
                ? "text-sm text-muted-foreground ml-4" 
                : "text-base"
            }`}
          >
            {format(new Date(date), "MMM dd, yyyy")}
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
    cell: ({ row, getValue }) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center min-h-[40px]">
          <span
            className={`${
              row.depth > 0 
                ? "text-sm text-muted-foreground ml-4" 
                : "text-base"
            }`}
          >
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center min-h-[40px]">
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