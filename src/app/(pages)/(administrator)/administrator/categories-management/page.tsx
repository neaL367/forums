import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { CategoriesDataTable } from "@/features/administrator/categories/categories-data-table-client";
import { categoriesColumns } from "@/features/administrator/categories/data/columns";
import { getAllCategories } from "@/database/categories";

export default async function CategoriesPage() {
  return (
    <div className=" mx-auto">
      <CategoriesTable />
    </div>
  );
}

async function CategoriesTable() {
  const getCachedAllCategories = unstable_cache(
    async () => getAllCategories(),
    ['id'],
    { tags: ["admin-mgt-categories"], revalidate: 3600 }
  );

  const categories = await getCachedAllCategories();
  if (!categories) return notFound();

  return <CategoriesDataTable columns={categoriesColumns} data={categories} />;
}
