"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Members } from "@/types/members";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../../shared/data-table/data-table-column-header";
import { MemberRowActions } from "../member-row-actions";

export const memberscolumns: ColumnDef<Members>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <div>{format(new Date(date), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.username}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      const variant =
        role === "ADMINISTRATOR"
          ? "default"
          : role === "MODERATOR"
            ? "secondary"
            : "outline";
      return <Badge variant={variant}>{role}</Badge>;
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Verified" />
    ),
    cell: ({ row }) => {
      const isVerified = row.original.emailVerified;
      return (
        <Badge variant={isVerified ? "default" : "secondary"}>
          {isVerified ? "Verified" : "Not Verified"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "banned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ban" />
    ),
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      return (
        <Badge variant={isBanned ? "destructive" : "default"}>
          {isBanned ? "Banned" : "Not Banned"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "banExpires",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ban Expires" />
    ),
    cell: ({ row }) => {
      const banExpires = row.original.banExpires;
      return (
        <div>
          {banExpires ? format(new Date(banExpires), "MMM dd, yyyy") : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <MemberRowActions row={row} />
    ),
  },
];
