import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header-client";
import { breadcrumbs } from "@/features/administrator/reports/data/data";

export default function ReportsPage() {
  return (
    <>
      <AdministratorHeader breadcrumbs={breadcrumbs} />
      <div className="space-y-8">Reports</div>
    </>
  );
}
