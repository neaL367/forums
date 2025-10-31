"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { DataTableSkeleton } from "@features/administrator/shared/data-table/data-table-skeleton";

import type { Member } from "@/types/member";
import type { ColumnDef } from "@tanstack/react-table";

const MembersDataTable = dynamic(
  () =>
    import("@features/administrator/members/data-table/members-data-table").then(
      (mod) => mod.MembersDataTable
    ),
  {
    ssr: false,
  }
);

export function MembersTableClient({ members }: { members: Member[] }) {
  const [columns, setColumns] = useState<ColumnDef<Member>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@features/administrator/members/data/columns").then((mod) => {
      setColumns(mod.membersColumns);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !columns.length) {
    return <DataTableSkeleton />;
  }

  return <MembersDataTable data={members} columns={columns} />;
}
