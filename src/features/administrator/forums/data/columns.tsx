import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Calendar, ChevronRight, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Forum } from "@/types/forum";

const ForumsColumnHeader = dynamic(
  () =>
    import("@/features/administrator/forums/data-table/forums-column-header").then(
      (mod) => ({ default: mod.ForumsColumnHeader }),
    ),
  {
    loading: () => <Skeleton className="h-8 w-24" />,
    ssr: false,
  },
);

const ForumsRowActions = dynamic(
  () =>
    import("@/features/administrator/forums/data-table/forums-row-actions").then(
      (mod) => ({ default: mod.ForumsRowActions }),
    ),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded" />,
    ssr: false,
  },
);

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm a");
  } catch {
    return "Invalid date";
  }
};

const matchesForumRecursive = (
  forum: Forum,
  predicate: (f: Forum) => boolean,
): boolean => {
  if (predicate(forum)) return true;
  return (
    forum.subForums?.some((sub) => matchesForumRecursive(sub, predicate)) ??
    false
  );
};

export const forumsColumns = (
  availableParentForums: Forum[],
): ColumnDef<Forum>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <ForumsColumnHeader column={column} title="Forum" />
    ),
    cell: ({ row }) => {
      const forum = row.original;
      const depth = row.depth;
      const hasSubForums = forum.subForums && forum.subForums.length > 0;
      const isExpanded = row.getIsExpanded();

      return (
        <div
          className="flex items-center gap-3 py-1"
          style={{ paddingLeft: `${depth * 32}px` }}
        >
          <div className="flex-shrink-0 pt-0.5">
            {hasSubForums ? (
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 rounded-full cursor-pointer hover:bg-accent transition-colors"
                onClick={() => row.toggleExpanded()}
                aria-label={
                  isExpanded ? "Collapse subforum" : "Expand subforum"
                }
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0 h-5 font-mono flex-shrink-0"
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
              <p className="text-muted-foreground text-sm max-w-[350px] text-wrap">
                {forum.description}
              </p>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, _columnId, value) => {
      if (typeof value === "string") {
        const search = value.toLowerCase();
        return matchesForumRecursive(
          row.original,
          (f) =>
            f.title.toLowerCase().includes(search) ||
            f.description?.toLowerCase().includes(search) ||
            false,
        );
      }
      return true;
    },
    enableHiding: false,
    enableSorting: true,
  },
  {
    id: "forumCategory",
    accessorFn: (row) => row.title,
    filterFn: (row, _columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return matchesForumRecursive(row.original, (f) =>
        value.includes(f.title),
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true,
  },
  {
    id: "depth",
    accessorFn: (row) => row.depth.toString(),
    filterFn: (row, _columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return matchesForumRecursive(row.original, (f) =>
        value.includes(f.depth.toString()),
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: "Topics",
    header: ({ column }) => (
      <ForumsColumnHeader column={column} title="Topics" />
    ),
    cell: ({ row }) => {
      const topicCount = row.original.topics?.length ?? 0;
      return (
        <div className="flex items-center gap-2 tabular-nums">{topicCount}</div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ForumsColumnHeader column={column} title="Created At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
      );
    },
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <ForumsColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return (
        <time dateTime={date} className="whitespace-nowrap">
          {formatDate(date)}
        </time>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ForumsRowActions
          row={row}
          availableParentForums={availableParentForums}
        />
      </div>
    ),
    header: () => (
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium">Actions</span>
      </div>
    ),
    size: 80,
  },
];
