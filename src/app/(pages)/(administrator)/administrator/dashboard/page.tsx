import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal";
import { DashboardClient } from "@/components/pages/administrator/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session || session.user.role !== "ADMINISTRATOR") redirect("/sign-in");

  return (
    <div className="max-w-7xl mx-auto p-6 my-10 space-y-8">
      {/* <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          
        </p>
      </div> */}
      <DashboardClient />
    </div>
  );
}
