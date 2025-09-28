import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";

export default function ReportsPage() {
  return (
    <>
      <AdministratorHeader
        breadcrumbs={[
          { label: "Administrator", href: "/administrator" },
          { label: "Reports" },
        ]}
      />
      <div className="space-y-8">Reports</div>
    </>
  );
}
