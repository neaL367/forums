import { Suspense } from "react";

import { TopicsTableClient } from "@/features/administrator/topics/data-table/topics-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header-client";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { breadcrumbs } from "@/features/administrator/topics/data/data";
import { getAllTopics } from "@/database/topics";
import { getForumsForAddTopic} from "@/database/forums";

async function TopicsTable() {
  const [topics, forums] = await Promise.all([getAllTopics(), getForumsForAddTopic()]);

  return <TopicsTableClient topics={topics} forums={forums} />;
}

export default async function TopicsPage() {
  return (
    <>
      <AdministratorHeader breadcrumbs={breadcrumbs} />
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