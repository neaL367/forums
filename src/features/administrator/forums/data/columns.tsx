"use client";

import { format } from "date-fns";
import { Calendar, ChevronRight, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/features/administrator/shared/data-table/data-table-column-header";
import { ForumsRowActions } from "@/features/administrator/forums/forums-row-actions";

import type { Forum } from "@/types/forum";

export const forumsColumns: ColumnDef<Forum>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Forum" />
    ),
    cell: ({ row }) => {
      const forum = row.original;
      const depth = row.depth;
      const hasSubForums =
        row.original.subForums && row.original.subForums.length > 0;

      return (
        <div
          className="flex items-center gap-3 py-1"
          style={{ paddingLeft: `${depth * 32}px` }}
        >
          {/* Expander button or spacer */}
          <div className="flex-shrink-0 pt-0.5">
            {hasSubForums ? (
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 rounded-full cursor-pointer"
                onClick={() => row.toggleExpanded()}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
          </div>

          {/* Forum content */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0 h-5 font-mono"
              >
                L{forum.depth}
              </Badge>
              <span
                className={
                  depth === 0
                    ? "text-card-foreground font-semibold text-base"
                    : "text-card-foreground font-medium"
                }
              >
                {forum.title}
              </span>
            </div>
            {forum.description && (
              <div className="text-muted-foreground text-sm max-w-[600px] truncate">
                {forum.description}
              </div>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, value) => {
      const searchValue = value.toLowerCase();
      const forum = row.original;

      // Check if current forum matches
      const matchesCurrent =
        forum.title.toLowerCase().includes(searchValue) ||
        (forum.description?.toLowerCase().includes(searchValue) ?? false);

      // Check if any subforum matches recursively
      const matchesSubforum = (subForums: Forum[] | undefined): boolean => {
        if (!subForums || subForums.length === 0) return false;

        return subForums.some(
          (sub) =>
            sub.title.toLowerCase().includes(searchValue) ||
            (sub.description?.toLowerCase().includes(searchValue) ?? false) ||
            matchesSubforum(sub.subForums)
        );
      };

      return matchesCurrent || matchesSubforum(forum.subForums);
    },
    enableHiding: false,
  },
  {
    accessorKey: "topicCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topics" />
    ),
    cell: ({ row }) => {
      const topicCount = row.original.topics?.length || 0;
      return <div className="flex items-center gap-2">{topicCount}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(date), "MMM dd, yyyy HH:mm a zzz")}
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span>{format(new Date(date), "MMM dd, yyyy HH:mm a zzz")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ForumsRowActions row={row} />
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