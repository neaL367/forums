"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { forumsColumns } from "@features/administrator/forums/data/columns";

import type { Forum } from "@/types/forum";

const ForumsDataTable = dynamic(
  () =>
    import("@features/administrator/forums/forums-data-table").then(
      (mod) => mod.ForumsDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

export function ForumsTableClient({ forums }: { forums: Forum[] }) {
  const columns = forumsColumns(forums);
  return <ForumsDataTable data={forums} columns={columns} />;
}
