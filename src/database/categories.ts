import "server-only"
import { randomUUID } from "crypto";

import { sql } from "@/lib/dal";
import type { Categories } from "@/types/categories";
import type { Forums } from "@/types/forums";

export const getAllCategories = async (): Promise<Categories[]> => {
  try {
    const categories = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c."createdAt",
        c."updatedAt"
      FROM public.category c
      ORDER BY c."createdAt" DESC;
    `;

    const forums = await sql`
      SELECT 
        f.id,
        f.title,
        f.description,
        f."categoryId",
        f."parentForumId",
        f."createdAt",
        f."updatedAt"
      FROM public.forum f;
    `;

    // Map forums into their categories
    return (categories as Categories[]).map((cat) => ({
      ...cat,
      forum_count: (forums as Forums[]).filter(
        (f) => f.categoryId === cat.id
      ).length,
      forums: (forums as Forums[]).filter((f) => f.categoryId === cat.id),
    }));
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw new Error("Failed to fetch categories");
  }
};


export const addCategories = async (data: {
  title: string;
  description: string;
}): Promise<Categories> => {
  try {
    const newId = randomUUID();

    const rows = await sql`
      INSERT INTO public.category (id, title, description, "createdAt", "updatedAt")
      VALUES (${newId}, ${data.title}, ${data.description}, NOW(), NOW())
      RETURNING id, title, description, "createdAt", "updatedAt"
    `;

    return rows[0] as Categories;
  } catch (error) {
    console.error("Error inserting categories:", error);
    throw new Error("Failed to add categories");
  }
};