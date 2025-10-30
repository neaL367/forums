"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { topicsColumns } from "@features/administrator/topics/data/columns";

import type { Topic } from "@/types/topic";
import type { Forum } from "@/types/forum";

const TopicsDataTable = dynamic(
  () =>
    import("@features/administrator/topics/data-table/topics-data-table").then(
      (mod) => mod.TopicsDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

export function TopicsTableClient({ topics, forums }: { topics: Topic[], forums?: Array<Pick<Forum, 'id' | 'title' | 'depth'>> }) {
  return <TopicsDataTable data={topics} forums={forums} columns={topicsColumns} />;
}
