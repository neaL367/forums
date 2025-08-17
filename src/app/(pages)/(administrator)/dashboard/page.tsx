import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) redirect("/sign-in");

  if (session.user.role !== "ADMINISTRATOR") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
