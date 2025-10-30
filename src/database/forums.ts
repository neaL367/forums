import "server-only"

import { sql } from "@/lib/auth-server";
import type { Forum } from "@/types/forum";
import type { Topic } from "@/types/topic";

export const getAllForums = async (): Promise<Forum[]> => {
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
    ` as Array<Pick<Forum, 'id' | 'title' | 'description' | 'createdAt' | 'updatedAt' | 'parentForumId' | 'parentForumTitle'>>;

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
    ` as Topic[];

    // Calculate depth for each forum
    const calculateDepth = (forumId: string, forumList: typeof forums, visited = new Set<string>()): number => {
      if (visited.has(forumId)) return 0; // Prevent circular references
      visited.add(forumId);

      const forum = forumList.find(f => f.id === forumId);
      if (!forum || !forum.parentForumId) return 0;

      return 1 + calculateDepth(forum.parentForumId, forumList, visited);
    };

    // Build a map of forums with depth
    const forumMap: Record<string, Forum> = {};
    forums.forEach((f) => {
      forumMap[f.id] = {
        ...f,
        depth: calculateDepth(f.id, forums),
        topics: topics.filter((t) => t.forumId === f.id),
        subForums: [],
      };
    });

    // Attach subforums to parents
    const roots: Forum[] = [];
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

export const getForumsForAddTopic = async (): Promise<Array<Pick<Forum, 'id' | 'title' | 'depth'>>> => {
  try {
    const forums = await sql`
      SELECT 
        f.id, 
        f.title, 
        f."parentForumId"
      FROM public.forum f
      ORDER BY f.title;
    ` as Array<{ id: string; title: string; parentForumId: string | null }>;

    // Calculate depth for each forum
    const calculateDepth = (
      forumId: string, 
      forumList: typeof forums, 
      visited = new Set<string>()
    ): number => {
      if (visited.has(forumId)) return 0;
      visited.add(forumId);
      
      const forum = forumList.find(f => f.id === forumId);
      if (!forum || !forum.parentForumId) return 0;
      
      return 1 + calculateDepth(forum.parentForumId, forumList, visited);
    };

    // Map to simple dropdown format
    return forums.map(f => ({
      id: f.id,
      title: f.title,
      depth: calculateDepth(f.id, forums),
    }));
  } catch (error) {
    console.error("Error fetching forums for dropdown:", error);
    return [];
  }
};

export async function insertForum(data: {
  title: string
  description: string
  parentForumId: string | null
}): Promise<Forum> {
  try {
    const result = await sql`
      INSERT INTO public.forum (title, description, "parentForumId", "createdAt", "updatedAt")
      VALUES (
        ${data.title},
        ${data.description},
        ${data.parentForumId},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return result[0] as Forum
  } catch (error) {
    console.error("[Database Error] Failed to insert forum:", error)
    throw new Error(`Failed to create forum: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateForum(data: {
  id: string
  title?: string
  description?: string
  parentForumId?: string | null
}): Promise<Forum> {
  try {
    const result = await sql`
      UPDATE public.forum
      SET 
        title = ${data.title},
        description = ${data.description},
        "parentForumId" = ${data.parentForumId},
        "updatedAt" = NOW()
      WHERE id = ${data.id}
      RETURNING 
        id,
        title,
        description,
        "parentForumId",
        "createdAt",
        "updatedAt"
    `

    if (result.length === 0) {
      throw new Error(`Forum with id ${data.id} not found`)
    }

    return result[0] as Forum
  } catch (error) {
    console.error("[Database Error] Failed to update forum:", error)
    throw new Error(`Failed to update forum: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function deleteForum(id: string): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM public.forum
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      throw new Error(`Forum with id ${id} not found`)
    }
  } catch (error) {
    console.error("[Database Error] Failed to delete forum:", error)
    throw new Error(`Failed to delete forum: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getForumDepth(id: string): Promise<number> {
  try {
    const forums = await sql`
      SELECT id, "parentForumId"
      FROM public.forum
    ` as Array<{ id: string; parentForumId: string | null }>;

    const calculateDepth = (forumId: string, forumList: typeof forums, visited = new Set<string>()): number => {
      if (visited.has(forumId)) return 0; // Prevent circular references
      visited.add(forumId);

      const forum = forumList.find(f => f.id === forumId);
      if (!forum || !forum.parentForumId) return 0;

      return 1 + calculateDepth(forum.parentForumId, forumList, visited);
    };

    return calculateDepth(id, forums);
  } catch (error) {
    console.error("[Database Error] Failed to get forum depth:", error)
    throw new Error(`Failed to calculate forum depth: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export const getForumsByTitle = async (query: string): Promise<Forum[]> => {
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

    return rows as Forum[]
  } catch (error) {
    console.error("Error fetching forums by title:", error)
    throw new Error("Failed to fetch forums by title")
  }
}
