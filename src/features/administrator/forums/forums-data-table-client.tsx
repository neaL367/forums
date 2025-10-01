"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { forumsColumns } from "@features/administrator/forums/data/columns";

import type { DataTableProps } from "@features/administrator/shared/data-table/data-table";
import type { Forum } from "@/types/forum";

const DataTable = dynamic<DataTableProps<Forum>>(
  () =>
    import("@features/administrator/shared/data-table/data-table").then(
      (mod) => mod.DataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

const ForumsToolbar = dynamic(
  () =>
    import("@features/administrator/forums/forums-toolbar").then(
      (mod) => mod.ForumsToolbar
    ),
  {
    loading: () => <Skeleton className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]" />,
    ssr: false,
  }
);

export function ForumsTableClient({ forums }: { forums: Forum[] }) {
  return (
    <DataTable
      data={forums}
      columns={forumsColumns}
      toolbar={(props) => (
        <ForumsToolbar table={props.table} allForums={forums} />
      )}
      getSubRows={(row: Forum) => row.subForums}
      enableExpanding
    />
  );
}
