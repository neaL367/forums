import { Suspense } from "react";

import { RepliesDataTable } from "@/features/administrator/replies/replies-data-table-client";
import { repliesColumns } from "@/features/administrator/replies/data/columns";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { getAllReplies } from "@/database/replies";

export default async function RepliesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Replies Management</h1>
      <p className="text-muted-foreground mt-2">
        View, moderate, and manage all user replies, including editing,
        deleting, and tracking response activity.
      </p>
      
      <Suspense fallback={<DataTableSkeleton />}>
        <RepliesTable />
      </Suspense>
    </div>
  );
}

async function RepliesTable() {
  const [replies] = await Promise.all([getAllReplies()]);

  return <RepliesDataTable data={replies} columns={repliesColumns} />;
}
