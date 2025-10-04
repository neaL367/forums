import { unstable_cache } from "next/cache";
import { Suspense } from "react";

import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { ForumsTableClient } from "@/features/administrator/forums/forums-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";
import { breadcrumbs } from "@/features/administrator/forums/data/data";
import { getAllForums } from "@/database/forums";

export default async function ForumsPage() {
  return (
    <>
      <AdministratorHeader breadcrumbs={breadcrumbs} />
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
    </>
  );
}

async function ForumsTable() {
  const getCachedAllForums = unstable_cache(async () => getAllForums(), 
    ["id"], {
    tags: ["admin-mgt-forums"],
    revalidate: 300,
  });

  const forums = await getCachedAllForums();

  return <ForumsTableClient forums={forums} />;
}
