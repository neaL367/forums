import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { Suspense } from "react";

import { MembersTableSkeleton } from "@/components/pages/administrator/members/tables/table-skeleton";
import { MembersTableClient } from "@/components/pages/administrator/members/tables/table-client";

import { Members } from "@/types/member";
import { auth } from "@/lib/auth";

export default async function MembersPage() {
   return (
    <div className="mx-auto">
      <Suspense fallback={<MembersTableSkeleton />}>
        <MembersData />
      </Suspense>
    </div>
  );
}

async function MembersData() {
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

  return <MembersTableClient data={members} />;
}
