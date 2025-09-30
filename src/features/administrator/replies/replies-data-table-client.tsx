"use client";

import dynamic from "next/dynamic";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { Reply } from "@/types/reply";

export const RepliesDataTable = dynamic<{
  columns: ColumnDef<Reply>[];
  data: Reply[];
}>(
  () =>
    import("@features/administrator/replies/replies-data-table").then(
      (mod) => mod.RepliesDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);
