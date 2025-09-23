"use client";

import dynamic from "next/dynamic";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { Forums } from "@/types/forums";

export const ForumsDataTable = dynamic<{
  columns: ColumnDef<Forums>[];
  data: Forums[];
}>(
  () =>
    import("@features/administrator/forums/forums-data-table").then((mod) => mod.ForumsDataTable),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);
