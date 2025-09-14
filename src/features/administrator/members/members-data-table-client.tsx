"use client";

import dynamic from "next/dynamic";
import type { ColumnDef } from "@tanstack/react-table";
import type { Members } from "@/types/members";

export const MembersDataTable = dynamic<{
  columns: ColumnDef<Members>[];
  data: Members[];
}>(() => import("./members-data-table").then((mod) => mod.MembersDataTable), {
  ssr: false,
  // loading: () => <p>Loading table...</p>,
});
