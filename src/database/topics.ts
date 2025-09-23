import "server-only"

import { sql } from "@/lib/dal";
import type { Topics } from "@/types/topics";
import type { Replies } from "@/types/replies";

export const getAllTopics = async (): Promise<Topics[]> => {
  try {
    const topics = await sql`
      SELECT 
        t.id, 
        t.title, 
        t."createdAt", 
        t."updatedAt", 
        t."forumId",
        f.title AS "forumTitle"
      FROM public.topic t
      JOIN public.forum f ON t."forumId" = f.id
      ORDER BY t."createdAt" DESC;
    `;

    const replies = await sql`
      SELECT 
        r.id, r."topicId", r."content", 
        r."createdAt", r."updatedAt", r."parentReplyId"
      FROM public.replies r;
    `;

    // map replies into topics
    return (topics as Topics[]).map(topic => ({
      ...topic,
      replies: (replies as Replies[]).filter(r => r.topicId === topic.id)
    }));
  } catch (error) {
    console.error("Error fetching all topics:", error);
    throw new Error("Failed to fetch topics");
  }
};

export const getTopicsByTitle = async (query: string): Promise<Topics[]> => {
  try {
    const rows = await sql`
      SELECT 
        t.id, 
        t.title
      FROM public.topic t
      WHERE t.title ILIKE ${"%" + query + "%"}
      ORDER BY t."createdAt" DESC;
    `

    return rows as Topics[]
  } catch (error) {
    console.error("Error fetching forums by title:", error)
    throw new Error("Failed to fetch forums by title")
  }
}

