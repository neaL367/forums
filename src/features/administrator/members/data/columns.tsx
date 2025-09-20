"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Members } from "@/types/members";

// import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { MemberRowActions } from "@/features/administrator/members/members-row-actions";

export const membersColumns: ColumnDef<Members>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="px-4">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //         className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="px-4">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //         className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  //   size: 60,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="ID" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2">
        <span className="text-sm font-mono text-muted-foreground">
          {row.original.id}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 200,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Username" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="px-4 py-2">
          <span className="text-sm font-semibold">
            {row.original.username}
          </span>
        </div>
      );
    },
    enableHiding: false,
    size: 120,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Role" />
      </div>
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      const variant =
        role === "ADMINISTRATOR"
          ? "default"
          : role === "MODERATOR"
            ? "secondary"
            : "outline";
      return (
        <div className="px-4 py-2">
          <Badge variant={variant} className="text-xs font-medium">
            {role}
          </Badge>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Email Verified" />
      </div>
    ),
    cell: ({ row }) => {
      const isVerified = row.original.emailVerified;
      return (
        <div className="px-4 py-2">
          <Badge 
            variant={isVerified ? "default" : "secondary"}
            className="text-xs font-medium"
          >
            {isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    size: 120,
  },
  {
    accessorKey: "banned",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Ban Status" />
      </div>
    ),
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      return (
        <div className="px-4 py-2">
          <Badge 
            variant={isBanned ? "destructive" : "outline"}
            className="text-xs font-medium"
          >
            {isBanned ? "Banned" : "Not Banned"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    size: 100,
  },
  {
    accessorKey: "banExpires",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Ban Expires" />
      </div>
    ),
    cell: ({ row }) => {
      const banExpires = row.original.banExpires;
      return (
        <div className="px-4 py-2">
          <span className="text-sm text-muted-foreground">
            {banExpires ? format(new Date(banExpires), "MMM dd, yyyy") : "N/A"}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Created At" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="px-4 py-2">
          <span className="text-sm font-medium">
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
      <div className="px-4">
        <DataTableColumnHeader column={column} title="Updated At" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return (
        <div className="px-4 py-2">
          <span className="text-sm font-medium">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="px-4 py-2 flex items-center justify-center">
        <MemberRowActions row={row} />
      </div>
    ),
    header: () => (
      <div className="px-4 flex items-center justify-center">
        <span className="text-sm font-medium">Actions</span>
      </div>
    ),
    size: 80,
  },
];