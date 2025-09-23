// src/database/replies.ts
import "server-only"
import { sql } from "@/lib/dal"
import type { Replies } from "@/types/replies"

export const getAllReplies = async (): Promise<Replies[]> => {
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
      FROM public.replies r
      LEFT JOIN public.topic t ON r."topicId" = t.id
      LEFT JOIN public.replies pr ON r."parentReplyId" = pr.id
      ORDER BY r."createdAt" ASC;
    `

    return rows as Replies[]
  } catch (error) {
    console.error("Error fetching all replies:", error)
    throw error
  }
}
