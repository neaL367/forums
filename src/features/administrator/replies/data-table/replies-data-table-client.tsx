"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";

import type { Reply } from "@/types/reply";
import type { ColumnDef } from "@tanstack/react-table";

const RepliesDataTable = dynamic(
  () =>
    import("@features/administrator/replies/data-table/replies-data-table").then(
      (mod) => mod.RepliesDataTable
    ),
  {
    ssr: false,
  }
);

export function RepliesTableClient({ replies }: { replies: Reply[] }) {
  const [columns, setColumns] = useState<ColumnDef<Reply>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@features/administrator/replies/data/columns").then((mod) => {
      setColumns(mod.repliesColumns);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !columns.length) {
    return <DataTableSkeleton />;
  }

  return <RepliesDataTable data={replies} columns={columns} />;
}
