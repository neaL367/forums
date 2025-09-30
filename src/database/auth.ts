import "server-only"

import { sql } from "@/lib/dal";
import type { Member } from "@/types/member";

export const forgotUsername = (async (email: string): Promise<Member> => {
  try {
    const rows = await sql`SELECT username, email, name FROM public.member WHERE email = ${email} LIMIT 1;`
    return (rows[0] as Member) || null
  } catch (error) {
    console.error("Error fetching member by ID:", error)
    throw new Error("Failed to fetch member")
  }
})
