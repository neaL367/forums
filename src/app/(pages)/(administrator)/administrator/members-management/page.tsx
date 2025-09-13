import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { MembersTableWrapper } from "@/features/administrator/members/members-table-wrapper";
import { membersColumns } from "@/features/administrator/members/data/columns";
import { MembersManagementSkeleton } from "./skeleton";

import { getServerSession } from "@/lib/dal";
import { auth } from "@/lib/auth";
import type { Members } from "@/types/members";

export default async function MembersPage() {
  const session = await getServerSession();

  if (!session) redirect("/");
  if (session.user.role !== "ADMINISTRATOR") redirect("/");

  return (
    <div className="mx-auto">
      <Suspense fallback={<MembersManagementSkeleton />}>
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
    { tags: ["members"], revalidate: 300 }
  );

  const headerData = await headers();
  const response = await getCachedMembers(headerData);
  const members: Members[] = (response?.members ?? []) as Members[];

  return <MembersTableWrapper data={members} columns={membersColumns} />;
}
