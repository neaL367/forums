"use client";

import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/types/member";

const MembersColumnHeader = dynamic(
  () =>
    import("@/features/administrator/members/members-column-header").then(
      (mod) => ({ default: mod.MembersColumnHeader })
    ),
  {
    loading: () => <Skeleton className="h-8 w-24" />,
    ssr: false,
  }
);

const MembersRowActions = dynamic(
  () =>
    import("@/features/administrator/members/members-row-actions").then(
      (mod) => ({ default: mod.MembersRowActions })
    ),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded" />,
    ssr: false,
  }
);

export const membersColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <div className="">
        <MembersColumnHeader column={column} title="Username" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <span className="text-sm">{row.original.username}</span>
        </div>
      );
    },
    enableHiding: false,
    size: 120,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div className="">
        <MembersColumnHeader column={column} title="Role" />
      </div>
    ),
    cell: ({ row }) => {
      const role = String(row.getValue("role")).toUpperCase();

      const variant =
        role === "ADMINISTRATOR"
          ? "default"
          : role === "MODERATOR"
            ? "secondary"
            : "outline";

      return (
        <div className="">
          <Badge variant={variant} className="text-xs font-medium">
            {role}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)).toUpperCase());
    },
    size: 100,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <div className="">
        <MembersColumnHeader column={column} title="Email Verified" />
      </div>
    ),
    cell: ({ row }) => {
      const isVerified = row.original.emailVerified;
      return (
        <div className="">
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
      return value.includes(row.getValue(id));
    },
    size: 120,
  },
  {
    accessorKey: "banned",
    header: ({ column }) => (
      <div className="">
        <MembersColumnHeader column={column} title="Ban Status" />
      </div>
    ),
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      return (
        <div className="">
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
      return value.includes(row.getValue(id));
    },
    size: 100,
  },
  {
    accessorKey: "banExpires",
    header: ({ column }) => (
      <div className="">
        <MembersColumnHeader column={column} title="Ban Expires" />
      </div>
    ),
    cell: ({ row }) => {
      const banExpires = row.original.banExpires;
      return (
        <div className="">
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
      <div className="">
        <MembersColumnHeader column={column} title="Created At" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="">
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
      <div className="">
        <MembersColumnHeader column={column} title="Updated At" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return (
        <div className="">
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
      <div className=" flex items-center justify-center">
        <MembersRowActions row={row} />
      </div>
    ),
    header: () => (
      <div className=" flex items-center justify-center">
        <span className="text-sm font-medium">Actions</span>
      </div>
    ),
    size: 80,
  },
];
