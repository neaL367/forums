"use client";

import dynamic from "next/dynamic";
import { Members } from "@/types/member";
import { MembersTableSkeleton } from "./table-skeleton";

const MembersTable = dynamic(
  () => import("./table").then(m => ({ default: m.MembersTable })),
  { 
    ssr: false,
    loading: () => <MembersTableSkeleton />
  }
);

interface MembersTableClientProps {
  data: Members[];
}

export function MembersTableClient({ data }: MembersTableClientProps) {
  return <MembersTable data={data} />;
}