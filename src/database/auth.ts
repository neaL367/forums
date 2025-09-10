import "server-only"

import { sql } from "@/lib/dal";
import type { Members } from "@/types/members";

export const forgotUsername = (async (email: string): Promise<Members> => {
  try {
    const rows = await sql`SELECT username, email, name FROM public.member WHERE email = ${email} LIMIT 1;`
    return (rows[0] as Members) || null
  } catch (error) {
    console.error("Error fetching member by ID:", error)
    throw new Error("Failed to fetch member")
  }
})
