import "server-only"

import { sql } from "@/lib/dal";
import type { Forums } from "@/types/forums";
import type { Topics } from "@/types/topics";

export const getAllForums = async (): Promise<Forums[]> => {
  try {
    const forums = await sql`
      SELECT 
        f.id, 
        f.title, 
        f.description, 
        f."createdAt", 
        f."updatedAt", 
        f."parentForumId",
        pf.title AS "parentForumTitle" 
      FROM public.forum f
      LEFT JOIN public.forum pf ON f."parentForumId" = pf.id;
    ` as Array<Pick<Forums, 'id' | 'title' | 'description' | 'createdAt' | 'updatedAt' | 'parentForumId' | 'parentForumTitle'>>;

    const topics = await sql`
      SELECT 
        t.id,
        t.title,
        t."createdAt",
        t."updatedAt",
        t."forumId",
        f.title AS "forumTitle"
      FROM public.topic t
      JOIN public.forum f ON t."forumId" = f.id;
    ` as Topics[];

    // Build a map of forums
    const forumMap: Record<string, Forums> = {};
    forums.forEach((f) => {
      forumMap[f.id] = {
        ...f,
        topics: topics.filter((t) => t.forumId === f.id),
        subForums: [],
      };
    });

    // Attach subforums to parents
    const roots: Forums[] = [];
    forums.forEach((f) => {
      if (f.parentForumId) {
        forumMap[f.parentForumId]?.subForums?.push(forumMap[f.id]);
      } else {
        roots.push(forumMap[f.id]);
      }
    });

    return roots;
  } catch (error) {
    console.error("Error fetching forums:", error);
    return [];
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
