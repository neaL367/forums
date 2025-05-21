"use server"

import { db } from "@/db/db"
import { users, accounts, sessions, verification } from "@/db/schema"
import { eq, and, gt } from "drizzle-orm"
import { hash, compare } from "bcryptjs"
import { nanoid } from "nanoid"

// Create a new user
export async function createUser(userData: {
  name: string
  email: string
  username: string
  password: string
  image?: string
}) {
  return await db.transaction(async (tx) => {
    // Create user
    const [user] = await tx
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: userData.name,
        email: userData.email,
        username: userData.username,
        displayUsername: userData.username,
        image: userData.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Hash password
    const hashedPassword = await hash(userData.password, 10)

    // Create credentials account
    await tx.insert(accounts).values({
      id: crypto.randomUUID(),
      userId: user.id,
      providerId: "credentials",
      accountId: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create email verification token
    const token = nanoid(32)
    const expires = new Date()
    expires.setDate(expires.getDate() + 3) // 3 days expiration

    await tx.insert(verification).values({
      id: crypto.randomUUID(),
      identifier: userData.email,
      value: token,
      expiresAt: expires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { user, verificationToken: token }
  })
}

// Authenticate user with credentials
export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user[0]) {
    return null
  }

  // Check if user is banned
  if (user[0].banned) {
    if (!user[0].banExpires || user[0].banExpires > new Date()) {
      throw new Error(user[0].banReason || "Your account has been suspended")
    }
    // If ban has expired, remove it
    await db
      .update(users)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(eq(users.id, user[0].id))
  }

  // Find account with credentials
  const account = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.userId, user[0].id), eq(accounts.providerId, "credentials")))
    .limit(1)

  if (!account[0] || !account[0].password) {
    return null
  }

  // Verify password
  const passwordValid = await compare(password, account[0].password)
  if (!passwordValid) {
    return null
  }

  return user[0]
}

// Create a new session
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = nanoid(32)
  const expires = new Date()
  expires.setDate(expires.getDate() + 30) // 30 days session

  const [session] = await db
    .insert(sessions)
    .values({
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt: expires,
      ipAddress,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return session
}

// Get session by token
export async function getSessionByToken(token: string) {
  const session = await db
    .select({
      id: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1)

  return session[0]
}

// Delete session
export async function deleteSession(token: string) {
  return db.delete(sessions).where(eq(sessions.token, token))
}

// Create password reset token
export async function createPasswordResetToken(email: string) {
  const token = nanoid(32)
  const expires = new Date()
  expires.setHours(expires.getHours() + 1) // 1 hour expiration

  await db.insert(verification).values({
    id: crypto.randomUUID(),
    identifier: email,
    value: token,
    expiresAt: expires,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return token
}

// Verify email
export async function verifyEmail(token: string) {
  return await db.transaction(async (tx) => {
    // Find verification token
    const verificationToken = await tx
      .select()
      .from(verification)
      .where(and(eq(verification.value, token), gt(verification.expiresAt, new Date())))
      .limit(1)

    if (!verificationToken[0]) {
      throw new Error("Invalid or expired verification token")
    }

    // Update user's email verification status
    await tx
      .update(users)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.email, verificationToken[0].identifier))

    // Delete the used token
    await tx.delete(verification).where(eq(verification.id, verificationToken[0].id))

    return true
  })
}
