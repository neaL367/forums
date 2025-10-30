"use client";

import { format } from "date-fns";
import dynamic from "next/dynamic";
import { MessageCircle, MessageSquare } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { Topic } from "@/types/topic";
import type { ColumnDef } from "@tanstack/react-table";

const TopicsColumnHeader = dynamic(
  () =>
    import("@/features/administrator/topics/topics-column-header").then(
      (mod) => ({ default: mod.TopicsColumnHeader })
    ),
  {
    loading: () => <Skeleton className="h-8 w-24" />,
    ssr: false,
  }
);

const TopicsRowActions = dynamic(
  () =>
    import("@/features/administrator/topics/topics-row-actions").then(
      (mod) => ({ default: mod.TopicsRowActions })
    ),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded" />,
    ssr: false,
  }
);

export const topicsColumns: ColumnDef<Topic>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <TopicsColumnHeader column={column} title="Topic" />
    ),
    cell: ({ getValue }) => {
      return (
        <div className="whitespace-normal break-words text-sm w-[400px]">
          {/* {isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
          {isLocked && <Lock className="h-3 w-3 text-red-500" />} */}
          <span className="text-sm font-medium">{getValue() as string}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "forumTitle",
    header: ({ column }) => (
      <TopicsColumnHeader column={column} title="Forum" />
    ),
    cell: ({ getValue }) => (
      <div className="text-xs flex gap-2">
        <MessageSquare className="h-4 w-4" />
        {getValue() as string}
      </div>
    ),
    filterFn: (row, id, value) => {
      const cellValue = String(row.getValue(id)).toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
  },
  {
    id: "replies",
    header: ({ column }) => (
      <TopicsColumnHeader column={column} title="Replies" />
    ),
    cell: ({ row }) => {
      const repliesCount = row.original.replies?.length || 0;
      return (
        <div className="text-xs flex gap-2">
          <MessageCircle className="h-4 w-4" />
          {repliesCount}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TopicsColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy HH:mm a zzz")}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <TopicsColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy HH:mm a zzz")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className=" flex items-center justify-center">
        <TopicsRowActions row={row} />
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
