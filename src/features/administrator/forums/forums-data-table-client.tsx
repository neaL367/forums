"use client";

import dynamic from "next/dynamic";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { Forum } from "@/types/forum";

export const ForumsDataTable = dynamic<{
  columns: ColumnDef<Forum>[];
  data: Forum[];
}>(
  () =>
    import("@features/administrator/forums/forums-data-table").then(
      (mod) => mod.ForumsDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);
