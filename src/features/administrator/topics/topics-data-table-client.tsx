"use client";

import dynamic from "next/dynamic";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { Topic } from "@/types/topic";

export const TopicsDataTable = dynamic<{
  columns: ColumnDef<Topic>[];
  data: Topic[];
}>(
  () =>
    import("@features/administrator/topics/topics-data-table").then(
      (mod) => mod.TopicsDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);
