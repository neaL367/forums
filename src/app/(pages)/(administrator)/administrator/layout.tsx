import { redirect } from "next/navigation";

import { AdministratorSidebar } from "@/features/administrator/shared/adminstrator-sidebar";
import { getServerSession } from "@/lib/dal";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function AdministratorLayout(
  props: LayoutProps<"/administrator">
) {
  const session = await getServerSession();

  if (!session) redirect("/");
  if (session.user.role !== "ADMINISTRATOR") redirect("/");
  return (
    <div className="flex h-screen bg-black">
      <AdministratorSidebar />
      <SidebarInset className="px-10 py-6">{props.children}</SidebarInset>
    </div>
  );
}
