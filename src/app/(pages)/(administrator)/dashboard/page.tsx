import { redirect } from "next/navigation"
import { verifySession } from "@/lib/dal"
import { Stats } from "@/components/dashboard/stats"
import { listMembersAction } from "@/actions/dashboard/member"

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session || session.user.role !== "ADMINISTRATOR") redirect("/sign-in")

  let stats = {
    totalUsers: 0,
    administrators: 0,
    members: 0,
    bannedUsers: 0,
  }

  try {
    const result = await listMembersAction({ limit: 1000, offset: 0 })

    if (result.success && result.members) {
      const allmembers = result.members
      stats = {
        totalUsers: allmembers.length,
        administrators: allmembers.filter((m) => m.role === "ADMINISTRATOR").length,
        members: allmembers.filter((m) => m.role === "MEMBERS").length,
        bannedUsers: allmembers.filter((m) => m.banned).length,
      }
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 my-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, roles, and system administration</p>
      </div>
    
      <Stats stats={stats} />
    </div>
  )
}
