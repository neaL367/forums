"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";

import type { Forum } from "@/types/forum";
import type { ColumnDef } from "@tanstack/react-table";

const ForumsDataTable = dynamic(
  () =>
    import("@features/administrator/forums/data-table/forums-data-table").then(
      (mod) => mod.ForumsDataTable
    ),
  {
    ssr: false,
  }
);

export function ForumsTableClient({ forums }: { forums: Forum[] }) {
  const [columns, setColumns] = useState<ColumnDef<Forum>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@features/administrator/forums/data/columns").then((mod) => {
      setColumns(mod.forumsColumns(forums));
      setIsLoading(false);
    });
  }, [forums]);

  if (isLoading || !columns.length) {
    return <DataTableSkeleton />;
  }

  return <ForumsDataTable data={forums} columns={columns} />;
}
