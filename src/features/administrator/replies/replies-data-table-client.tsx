"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { repliesColumns } from "@features/administrator/replies/data/columns";

import type { Reply } from "@/types/reply";

const RepliesDataTable = dynamic(
  () =>
    import("@features/administrator/replies/replies-data-table").then(
      (mod) => mod.RepliesDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

export function RepliesTableClient({ replies }: { replies: Reply[] }) {
  return <RepliesDataTable data={replies} columns={repliesColumns} />;
}
