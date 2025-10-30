import "server-only";

import { sql } from "@/lib/auth-server";
import type { Topic } from "@/types/topic";
import type { Reply } from "@/types/reply";

export const getAllTopics = async (): Promise<Topic[]> => {
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
      FROM public.reply r;
    `;

    // map replies into topics
    return (topics as Topic[]).map((topic) => ({
      ...topic,
      replies: (replies as Reply[]).filter((r) => r.topicId === topic.id),
    }));
  } catch (error) {
    console.error("Error fetching all topics:", error);
    throw new Error("Failed to fetch topics");
  }
};

export const getTopicsByTitle = async (query: string): Promise<Topic[]> => {
  try {
    const rows = await sql`
      SELECT
        t.id,
        t.title
      FROM public.topic t
      WHERE t.title ILIKE ${"%" + query + "%"}
      ORDER BY t."createdAt" DESC;
    `;

    return rows as Topic[];
  } catch (error) {
    console.error("Error fetching forums by title:", error);
    throw new Error("Failed to fetch forums by title");
  }
};

export async function insertTopic(data: {
  title: string;
  forumId: string;
}): Promise<Topic> {
  try {
    const result = await sql`
      INSERT INTO public.topic (title, "forumId", "createdAt", "updatedAt")
      VALUES (
        ${data.title},
        ${data.forumId},
        NOW(),
        NOW()
      )
      RETURNING 
        id,
        title,
        "createdAt",
        "updatedAt",
        "forumId"
    `;

    return result[0] as Topic;
  } catch (error) {
    console.error("[Database Error] Failed to insert topic:", error);
    throw new Error(
      `Failed to create topic: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}