import "server-only"

import { sql } from "@/lib/neon-database";
import type { Reply } from "@/types/reply"

export const getAllReplies = async (): Promise<Reply[]> => {
  try {
    const rows = await sql`
      SELECT
        r.id,
        r."createdAt",
        r."updatedAt",
        r."topicId",
        r."parentReplyId",
        r.content,
        t.title AS "topicTitle",
        pr.content AS "parentReplyContent"
      FROM public.reply r
      LEFT JOIN public.topic t ON r."topicId" = t.id
      LEFT JOIN public.reply pr ON r."parentReplyId" = pr.id
      ORDER BY r."createdAt" ASC;
    `

    return rows as Reply[]
  } catch (error) {
    console.error("Error fetching all replies:", error)
    throw error
  }
}
