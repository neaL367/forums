"use server"

import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendUsernameRecoveryEmail } from "@/actions/email"

export async function recoverUsername(email: string) {
  try {
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)

    const user = foundUsers[0]

    // If user exists, send email with username
    if (user && user.username) {
      await sendUsernameRecoveryEmail(email, user.username, user.name)
    }

    // Always return success to prevent email enumeration
    return { success: true }
  } catch (error) {
    console.error("Error recovering username:", error)
    return { success: true }
  }
}
