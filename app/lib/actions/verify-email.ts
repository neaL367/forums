"use server"

import { db } from "@/db/db"
import { users, verification } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendVerificationEmail } from "@/actions/email"

export async function verifyEmail(token: string) {
  try {
    // Find the verification token
    const foundTokens = await db.select().from(verification).where(eq(verification.value, token)).limit(1)

    const verificationToken = foundTokens[0]

    // If token doesn't exist or has expired
    if (!verificationToken || new Date() > verificationToken.expiresAt) {
      return {
        success: false,
        error: verificationToken ? "Verification token has expired" : "Invalid verification token",
      }
    }

    // Update user's email verification status
    // The identifier should be the user's email
    await db.update(users).set({ emailVerified: true }).where(eq(users.email, verificationToken.identifier))

    // Delete the used token
    await db.delete(verification).where(eq(verification.id, verificationToken.id))

    return { success: true }
  } catch (error) {
    console.error("Error verifying email:", error)
    return {
      success: false,
      error: "An unexpected error occurred during verification",
    }
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    // Find user by email
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = foundUsers[0]

    if (!user) {
      // Don't reveal if user exists
      return { success: true }
    }

    if (user.emailVerified) {
      return { success: true, alreadyVerified: true }
    }

    // Generate verification URL
    const token = crypto.randomUUID()
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // 1 hour expiration

    // Store token in database
    await db.insert(verification).values({
      id: crypto.randomUUID(),
      identifier: email,
      value: token,
      expiresAt: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create verification URL
    const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}`

    // Send verification email
    await sendVerificationEmail(email, verificationUrl, user.name)

    return { success: true }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, error: "Failed to resend verification email" }
  }
}
