import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "@/features/administrator/shared/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/features/administrator/shared/data-table/data-table-view-options";

import type { Member, Roles } from "@/types/member";
import type { Table } from "@tanstack/react-table";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function MembersToolbar<TData extends Member>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const allRoles: Roles[] = [
    "OWNER",
    "ADMINISTRATOR",
    "MODERATOR",
    "STAFF",
    "MEMBERS",
    "GUEST",
  ];

  const roleOptions = allRoles.map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  }));

  const emailVerifiedOptions = [
    { value: true, label: "Verified" },
    { value: false, label: "Not Verified" },
  ];

  const bannedOptions = [
    { value: true, label: "Banned" },
    { value: false, label: "Not Banned" },
  ];

  const filters = [
    { columnId: "role", title: "Role", options: roleOptions },
    {
      columnId: "emailVerified",
      title: "Email Verified",
      options: emailVerifiedOptions,
    },
    { columnId: "banned", title: "Ban", options: bannedOptions },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0 w-full">
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center flex-wrap gap-2 w-full">
        <Input
          placeholder="Search by username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
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

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 flex items-center"
          >
            <X className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>

      <div className="mt-2 lg:mt-0">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
