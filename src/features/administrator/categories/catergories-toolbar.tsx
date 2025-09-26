"use client";

import { X, Plus } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/features/administrator/shared/data-table/data-table-view-options";
import { AddCategoriesDialog } from "@/features/administrator/categories/dialogs/add-categories-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CategoriesToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0 w-full">
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
        <Input
          placeholder="Search by Title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[350px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
        <DataTableViewOptions table={table} />
        <AddCategoriesDialog>
          <Button variant="outline" size="sm">
            <Plus className="md:mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Add Categories</span>
          </Button>
        </AddCategoriesDialog>
      </div>
    </div>
  );
}
