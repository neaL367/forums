"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { topicsColumns } from "@features/administrator/topics/data/columns";

import type { Topic } from "@/types/topic";

const TopicsDataTable = dynamic(
  () =>
    import("@features/administrator/topics/topics-data-table").then(
      (mod) => mod.TopicsDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

export function TopicsTableClient({ topics }: { topics: Topic[] }) {
  return <TopicsDataTable data={topics} columns={topicsColumns} />;
}
