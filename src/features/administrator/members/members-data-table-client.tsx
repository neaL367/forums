"use client";

import dynamic from "next/dynamic";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/types/member";

export const MembersDataTable = dynamic<{
  columns: ColumnDef<Member>[];
  data: Member[];
}>(
  () =>
    import("@features/administrator/members/members-data-table").then(
      (mod) => mod.MembersDataTable
    ),
  {
    ssr: false,
    loading: () => <DataTableSkeleton />,
  }
);
