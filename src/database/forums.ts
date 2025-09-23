import "server-only"

import { sql } from "@/lib/dal";
import type { Forums } from "@/types/forums";

export const getAllForums = async (): Promise<Forums[]> => {
  try {
    const rows = await sql`
      SELECT 
        f.id, 
        f.title, 
        f.description, 
        f."createdAt", 
        f."updatedAt", 
        f."categoryId",
        f."parentForumId",
        c.title AS "categoryTitle",
        pf.title AS "parentForumTitle"
      FROM public.forum f
      JOIN public.category c ON f."categoryId" = c.id
      LEFT JOIN public.forum pf ON f."parentForumId" = pf.id
      ORDER BY f."createdAt" DESC;
    `;

    return rows as Forums[];
  } catch (error) {
    console.error("Error fetching all forums:", error);
    throw new Error("Failed to fetch forums");
  }
};


export const getForumsByTitle = async (query: string): Promise<Forums[]> => {
  try {
    const rows = await sql`
      SELECT 
        f.id, 
        f.title, 
        f.description
      FROM public.forum f
      WHERE f.title ILIKE ${"%" + query + "%"}
      ORDER BY f."createdAt" DESC;
    `

    return rows as Forums[]
  } catch (error) {
    console.error("Error fetching forums by title:", error)
    throw new Error("Failed to fetch forums by title")
  }
}
