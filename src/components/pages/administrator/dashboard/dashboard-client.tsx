"use client";

import dynamic from "next/dynamic";

const Stats = dynamic(
  () => import("@/components/pages/administrator/dashboard/stats").then(m => m.Stats),
  { ssr: false }
);

const VisitorsChart = dynamic(
  () => import("@/components/pages/administrator/dashboard/chart").then(m => m.VisitorsChart),
  { ssr: false }
);

const MembersChart = dynamic(
  () => import("@/components/pages/administrator/dashboard/chart").then(m => m.MembersChart),
  { ssr: false }
);

const TopicsChart = dynamic(
  () => import("@/components/pages/administrator/dashboard/chart").then(m => m.TopicsChart),
  { ssr: false }
);

const ForumsChart = dynamic(
  () => import("@/components/pages/administrator/dashboard/chart").then(m => m.ForumsChart),
  { ssr: false }
);

export function DashboardClient() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Stats />
      
      {/* Charts Grid */}
      <div className="flex flex-col gap-6">
        <VisitorsChart />
        <MembersChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopicsChart />
        <ForumsChart />
      </div>
    </div>
  );
}