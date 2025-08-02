import "server-only"

import { sql } from "@/lib/dal";
import type { User } from "@/types/user";

export const forgotUsername = (async (email: string): Promise<User> => {
  try {
    const rows = await sql`SELECT username FROM public.user WHERE email = ${email} LIMIT 1;`
    return (rows[0] as User) || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw new Error("Failed to fetch user")
  }
})
