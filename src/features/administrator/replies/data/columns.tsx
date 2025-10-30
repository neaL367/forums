"use client";

import { format } from "date-fns";
import dynamic from "next/dynamic";
import { FileText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { Reply } from "@/types/reply";
import type { ColumnDef } from "@tanstack/react-table";

const RepliesColumnHeader = dynamic(
  () =>
    import("@/features/administrator/replies/data-table/replies-column-header").then(
      (mod) => ({ default: mod.RepliesColumnHeader })
    ),
  {
    loading: () => <Skeleton className="h-8 w-24" />,
    ssr: false,
  }
);

const RepliesRowActions = dynamic(
  () =>
    import("@/features/administrator/replies/data-table/replies-row-actions").then(
      (mod) => ({ default: mod.RepliesRowActions })
    ),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded" />,
    ssr: false,
  }
);

export const repliesColumns: ColumnDef<Reply>[] = [
  {
    accessorKey: "content",
    header: ({ column }) => (
      <RepliesColumnHeader column={column} title="Reply" />
    ),
    cell: ({ getValue }) => (
      <div className="text-sm w-[300px] truncate">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "topicTitle",
    header: ({ column }) => (
      <RepliesColumnHeader column={column} title="Topic" />
    ),
    cell: ({ getValue }) => (
      <div className="text-xs flex gap-2">
        <FileText className="h-4 w-4" />
        {getValue() as string}
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <RepliesColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <RepliesColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className=" flex items-center justify-center">
        <RepliesRowActions row={row} />
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
