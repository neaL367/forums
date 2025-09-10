import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { Suspense } from "react";

import { Members } from "@/types/members";
import { auth } from "@/lib/auth";
import { DataTable } from "@/components/pages/administrator/shared/data-table/data-table";
import { memberscolumns } from "@/components/pages/administrator/members/data/columns";
import { filters } from "@/components/pages/administrator/members/data/data";
import { MembersManagementSkeleton } from "./skeleton";

export default async function MembersPage() {
  return (
    <div className="mx-auto">
      <Suspense
        fallback={<MembersManagementSkeleton />}
      >
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
    ["members-list"],
    { tags: ["members"], revalidate: 3600 }
  );

  const headerData = await headers();
  const response = await getCachedMembers(headerData);
  const members: Members[] = (response?.members ?? []) as Members[];

  return (
    <DataTable
      data={members}
      columns={memberscolumns}
      searchColumn="username"
      searchPlaceholder="Search username members..."
      filters={filters}
    />
  );
}
