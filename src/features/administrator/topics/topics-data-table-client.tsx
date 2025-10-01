"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { topicsColumns } from "@features/administrator/topics/data/columns";

import type { DataTableProps } from "@features/administrator/shared/data-table/data-table";
import type { Topic } from "@/types/topic";

const DataTable = dynamic<DataTableProps<Topic>>(
  () =>
    import("@features/administrator/shared/data-table/data-table").then(
      (mod) => mod.DataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

const TopicsToolbar = dynamic(
  () =>
    import("@features/administrator/topics/topics-toolbar").then(
      (mod) => mod.TopicsToolbar
    ),
  {
    ssr: false,
  }
);

export function TopicsTableClient({ topics }: { topics: Topic[] }) {
  return (
    <DataTable
      data={topics}
      columns={topicsColumns}
      toolbar={(props) => <TopicsToolbar table={props.table} />}
    />
  );
}
