"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { membersColumns } from "@features/administrator/members/data/columns";

import type { DataTableProps } from "@features/administrator/shared/data-table/data-table";
import type { Member } from "@/types/member";

const DataTable = dynamic<DataTableProps<Member>>(
  () =>
    import("@features/administrator/shared/data-table/data-table").then(
      (mod) => mod.DataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

const MembersToolbar = dynamic(
  () =>
    import("@features/administrator/members/members-toolbar").then(
      (mod) => mod.MembersToolbar
    ),
  {
    loading: () => (
      <Skeleton className="h-8 w-full sm:w-[150px] md:w-[250px] lg:w-[300px]" />
    ),
    ssr: false,
  }
);

export function MembersTableClient({ members }: { members: Member[] }) {
  return (
    <DataTable
      data={members}
      columns={membersColumns}
      toolbar={(props) => <MembersToolbar table={props.table} />}
    />
  );
}
