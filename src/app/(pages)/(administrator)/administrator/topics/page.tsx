import { Suspense } from "react";

import { TopicsDataTable } from "@/features/administrator/topics/topics-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";
import { topicsColumns } from "@/features/administrator/topics/data/columns";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { getAllTopics } from "@/database/topics";

export default async function TopicsPage() {
  return (
    <>
      <AdministratorHeader
        breadcrumbs={[
          { label: "Administrator", href: "/administrator" },
          { label: "Topics" },
        ]}
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Topics Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage discussion topics and their status across forums
          </p>
        </div>

        <Suspense fallback={<DataTableSkeleton />}>
          <TopicsTable />
        </Suspense>
      </div>
    </>
  );
}

async function TopicsTable() {
  const [topics] = await Promise.all([getAllTopics()]);

  return <TopicsDataTable data={topics} columns={topicsColumns} />;
}
