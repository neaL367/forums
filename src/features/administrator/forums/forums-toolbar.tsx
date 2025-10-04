import { X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "@features/administrator/shared/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@features/administrator/shared/data-table/data-table-faceted-filter";
import { AddForumDialog } from "@features/administrator/forums/dialogs/add-forum-dialog";
import { filters } from "@features/administrator/forums/data/data";

import type { Forum } from "@/types/forum";
import type { Table } from "@tanstack/react-table";

interface ForumsToolbarProps<TData> {
  table: Table<TData>;
  allForums: Forum[];
}

export function ForumsToolbar<TData extends Forum>({ 
  table, 
  allForums 
}: ForumsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
        {/* Search Input */}
        <Input
          placeholder="Search forums..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]"
        />

        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          ) : null;
        })}

        {/* Reset Filters */}
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

      <div className="flex flex-wrap gap-2">
        <DataTableViewOptions table={table} />
        <AddForumDialog availableParentForums={allForums}>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Forum
          </Button>
        </AddForumDialog>
      </div>
    </div>
  );
}
