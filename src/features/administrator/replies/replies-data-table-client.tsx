"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { repliesColumns } from "@features/administrator/replies/data/columns";

import type { DataTableProps } from "@features/administrator/shared/data-table/data-table";
import type { Reply } from "@/types/reply";

const DataTable = dynamic<DataTableProps<Reply>>(
  () =>
    import("@features/administrator/shared/data-table/data-table").then(
      (mod) => mod.DataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

const RepliesToolbar = dynamic(
  () =>
    import("@features/administrator/replies/replies-toolbar").then(
      (mod) => mod.RepliesToolbar
    ),
  {
    loading: () => (
      <Skeleton className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]" />
    ),
    ssr: false,
  }
);

export function RepliesTableClient({ replies }: { replies: Reply[] }) {
  return (
    <DataTable
      data={replies}
      columns={repliesColumns}
      toolbar={(props) => <RepliesToolbar table={props.table} />}
    />
  );
}
