import { Suspense } from "react";

import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { RepliesTableClient } from "@/features/administrator/replies/data-table/replies-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";
import { breadcrumbs } from "@/features/administrator/replies/data/data";
import { getAllReplies } from "@/database/replies";

export default async function RepliesPage() {
  return (
    <>
      <AdministratorHeader breadcrumbs={breadcrumbs} />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Replies Management
        </h1>
        <p className="text-muted-foreground mt-2">
          View, moderate, and manage all user replies, including editing,
          deleting, and tracking response activity.
        </p>

        <Suspense fallback={<DataTableSkeleton />}>
          <RepliesTable />
        </Suspense>
      </div>
    </>
  );
}

async function RepliesTable() {
  const replies = await getAllReplies();

  return <RepliesTableClient replies={replies} />;
}
