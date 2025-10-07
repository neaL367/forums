import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { Suspense } from "react";

import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";
import { MembersTableClient } from "@/features/administrator/members/members-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";
import { breadcrumbs } from "@/features/administrator/members/data/data";

import { auth } from "@/lib/auth";
import type { Member } from "@/types/member";

const getCachedMembers = unstable_cache(
  async (headerData: Headers) => {
    try {
      const res = await auth.api.listUsers({
        query: {},
        headers: headerData,
      });

      return {
        success: true,
        members: res.users,
        total: res.total,
      };
    } catch {
      return {
        success: false,
        message: "An unexpected error occurred while fetching members.",
      };
    }
  },
  ["id"],
  { tags: ["admin-mgt-members"], revalidate: 3600 }
);

async function MembersTable() {
  const headerData = await headers();
  const response = await getCachedMembers(headerData);
  const members: Member[] = (response?.members ?? []) as Member[];

  return <MembersTableClient members={members} />;
}

export default async function MembersManagementPage() {
  return (
    <>
      <AdministratorHeader breadcrumbs={breadcrumbs} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Members Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage member role, username, ban and more...
          </p>
        </div>

        <Suspense fallback={<DataTableSkeleton />}>
          <MembersTable />
        </Suspense>
      </div>
    </>
  );
}
