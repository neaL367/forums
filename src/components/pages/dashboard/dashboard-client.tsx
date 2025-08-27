"use client";

import dynamic from "next/dynamic";

const RevenueMembers = dynamic(
  () => import("@/components/pages/dashboard/revenue-members").then(m => m.RevenueMembers),
  { ssr: false }
);
const TableReports = dynamic(
  () => import("@/components/pages/dashboard/table-reports").then(m => m.TableReports),
  { ssr: false }
);
const ChartVisitors = dynamic(
  () => import("@/components/pages/dashboard/chart-visitors").then(m => m.ChartVisitors),
  { ssr: false }
);

export function DashboardClient() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <RevenueMembers />
      <div>
        <ChartVisitors />
      </div>
      <TableReports data={[]} />
    </div>
  );
}
