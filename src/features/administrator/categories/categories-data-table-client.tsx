"use client";

import dynamic from "next/dynamic";
import type { ColumnDef } from "@tanstack/react-table";
import type { Categories } from "@/types/categories";

export const CategoriesDataTable = dynamic<{
  columns: ColumnDef<Categories>[];
  data: Categories[];
}>(
  () =>
    import("@features/administrator/categories/categories-data-table").then((mod) => mod.CategoriesDataTable),
  {
    ssr: false,
    // loading: () => <p>Loading table...</p>,
  }
);
