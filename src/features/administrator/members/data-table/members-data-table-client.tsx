"use client";

import dynamic from "next/dynamic";

import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import { membersColumns } from "@features/administrator/members/data/columns";

import type { Member } from "@/types/member";

const MembersDataTable = dynamic(
  () =>
    import("@features/administrator/members/data-table/members-data-table").then(
      (mod) => mod.MembersDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);

export function MembersTableClient({ members }: { members: Member[] }) {
  return <MembersDataTable data={members} columns={membersColumns} />;
}
