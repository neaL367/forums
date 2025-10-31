"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";

import type { Topic } from "@/types/topic";
import type { Forum } from "@/types/forum";
import type { ColumnDef } from "@tanstack/react-table";

const TopicsDataTable = dynamic(
  () =>
    import("@features/administrator/topics/data-table/topics-data-table").then(
      (mod) => mod.TopicsDataTable
    ),
  {
    ssr: false,
  }
);

export function TopicsTableClient({ topics, forums }: { topics: Topic[], forums?: Array<Pick<Forum, 'id' | 'title' | 'depth'>> }) {
  const [columns, setColumns] = useState<ColumnDef<Topic>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@features/administrator/topics/data/columns").then((mod) => {
      setColumns(mod.topicsColumns);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !columns.length) {
    return <DataTableSkeleton />;
  }

  return <TopicsDataTable data={topics} forums={forums} columns={columns} />;
}
