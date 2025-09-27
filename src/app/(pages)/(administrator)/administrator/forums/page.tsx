import { Suspense } from "react";

import { ForumsDataTable } from "@/features/administrator/forums/forums-data-table-client";
import { forumsColumns } from "@/features/administrator/forums/data/columns";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { getAllForums } from "@/database/forums";

export default async function ForumsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Forums Management
        </h1>
        Oversee and manage member accounts, including roles, permissions and
        usernames.
      </div>
      
      <Suspense fallback={<DataTableSkeleton />}>
        <ForumsTable />
      </Suspense>
    </div>
  );
}

async function ForumsTable() {
  const [forums] = await Promise.all([getAllForums()]);

  return <ForumsDataTable data={forums} columns={forumsColumns} />;
}
