import { redirect } from "next/navigation";

import { AdministratorSidebar } from "@/features/administrator/shared/adminstrator-sidebar";
import { authServer } from "@/lib/auth-server";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function AdministratorLayout(
  props: LayoutProps<"/administrator">
) {
  const session = await authServer();

  if (!session) redirect("/");
  if (session.user.role !== "ADMINISTRATOR") redirect("/");
  return (
    <div className="flex h-full bg-black">
      <AdministratorSidebar />
      <SidebarInset className="px-10 pt-6 pb-20">{props.children}</SidebarInset>
    </div>
  );
}
