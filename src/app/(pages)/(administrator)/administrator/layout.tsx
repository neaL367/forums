import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal";
import AdministratorSidebar from "@/components/pages/administrator/shared/sidebar-navigation";

export default async function AdministratorLayout(
  props: LayoutProps<"/administrator">
) {
  const session = await verifySession();

  if (!session || session.user.role !== "ADMINISTRATOR") redirect("/");
  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Administrator</h1>
        <p className="text-zinc-300">
          Admin dashboard for managing forum features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <AdministratorSidebar />
        </div>
        <div className="lg:col-span-4 space-y-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}
