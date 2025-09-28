import { Suspense } from "react";

import { CategoriesDataTable } from "@/features/administrator/categories/categories-data-table-client";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header";
import { categoriesColumns } from "@/features/administrator/categories/data/columns";
import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton";

import { getAllCategories } from "@/database/categories";

export default async function CategoriesPage() {
  return (
    <>
      <AdministratorHeader
        breadcrumbs={[
          { label: "Administrator", href: "/administrator" },
          { label: "Categories" },
        ]}
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Categories Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize your forums into categories for better navigation
          </p>
        </div>

        <Suspense fallback={<DataTableSkeleton />}>
          <CategoriesTable />
        </Suspense>
      </div>
    </>
  );
}

async function CategoriesTable() {
  const [categories] = await Promise.all([getAllCategories()]);

  return <CategoriesDataTable data={categories} columns={categoriesColumns} />;
}
