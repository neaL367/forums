import { redirect } from "next/navigation";

import { AdministratorSidebar } from "@/features/administrator/shared/adminstrator-sidebar";
import { getServerSession } from "@/lib/dal";

export default async function AdministratorLayout(
  props: LayoutProps<"/administrator">
) {
  const session = await getServerSession();

  if (!session) redirect("/");
  if (session.user.role !== "ADMINISTRATOR") redirect("/");
  return (
    <div className="flex h-screen bg-background">
      <AdministratorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{props.children}</main>
      </div>
    </div>
  );
}
