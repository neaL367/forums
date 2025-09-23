import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { membersColumns } from "@/features/administrator/members/data/columns";
import { MembersDataTable } from "@/features/administrator/members/members-data-table-client";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";

import { getServerSession } from "@/lib/dal";
import { auth } from "@/lib/auth";
import type { Members } from "@/types/members";

export default async function MembersManagementPage() {
  const session = await getServerSession();

  if (!session) redirect("/");
  if (session.user.role !== "ADMINISTRATOR") redirect("/");

  return (
    <div className="mx-auto">
      <Suspense fallback={<DataTableSkeleton />}>
        <MembersTable />
      </Suspense>
    </div>
  );
}

async function MembersTable() {
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
    ['id'],
    { tags: ["admin-mgt-members"], revalidate: 3600 }
  );

  const headerData = await headers();
  const response = await getCachedMembers(headerData);
  const members: Members[] = (response?.members ?? []) as Members[];

  return <MembersDataTable data={members} columns={membersColumns} />;
}
