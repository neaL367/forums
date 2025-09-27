import "server-only"

import { sql } from "@/lib/dal";
import type { Forums } from "@/types/forums";
import type { Topics } from "@/types/topics";

function flattenForums(forums: Forums[], parentTitle?: string): Forums[] {
  const result: Forums[] = [];

  forums.forEach((forum) => {
    result.push({
      ...forum,
      parentForumTitle: parentTitle || forum.parentForumTitle || undefined,
      subForums: [], // don’t keep nested here
    });

    if (forum.subForums && forum.subForums.length > 0) {
      result.push(...flattenForums(forum.subForums, forum.title));
    }
  });

  return result;
}

export const getAllForums = async (): Promise<Forums[]> => {
  try {
    const forums = await sql`
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

    const topics = await sql`
      SELECT 
        t.id,
        t.title,
        t."createdAt",
        t."updatedAt",
        t."forumId"
      FROM public.topic t;
    `;

    const forumList = forums as Forums[];
    const topicList = topics as Topics[];

    const forumMap = new Map<string, Forums>();
    forumList.forEach((f) => {
      forumMap.set(f.id, {
        ...f,
        topics: topicList.filter((t) => t.forumId === f.id),
        subForums: [],
      });
    });

    forumMap.forEach((forum) => {
      if (forum.parentForumId && forumMap.has(forum.parentForumId)) {
        forumMap.get(forum.parentForumId)!.subForums!.push(forum);
      }
    });

    // collect root forums
    const roots = Array.from(forumMap.values()).filter(
      (f) => !f.parentForumId
    );

    // flatten all into rows
    return flattenForums(roots);
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
