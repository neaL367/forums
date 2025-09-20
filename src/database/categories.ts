import "server-only"
import { randomUUID } from "crypto";

import { Categories } from "@/types/categories";
import { sql } from "@/lib/dal";

export const getAllCategories = async (): Promise<Categories[]> => {
  try {
    const rows = await sql`
      SELECT id, title, description, "createdAt", "updatedAt"
      FROM public.category
      ORDER BY "createdAt" DESC;
    `;

    return rows as Categories[];
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