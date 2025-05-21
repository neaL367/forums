"use server"

import { db } from "@/db/db"
import { users, userProfiles, badges, userBadges, reputationEvents, posts, threads, favorites, subscriptions } from "@/db/schema"
import { asc, eq, desc, sql, count } from "drizzle-orm"

// Get user by ID with profile
export async function getUserById(userId: string) {
  const result = await db
    .select({
      users: users,            
      profile: userProfiles,   
      postCount: db.$count(
        posts,
        eq(posts.userId, users.id)
      ),              
      favoriteCount: db.$count(
        favorites,
        eq(favorites.userId, users.id)
      ),              
      subscriptionCount: db.$count(
        subscriptions,
        eq(subscriptions.userId, users.id)
      ),
    })
    .from(users)
    .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
    .where(eq(users.id, userId))
    .limit(1)

  return result[0]
}

// Get user by username
export async function getUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  return result[0]
}

// Get user by email
export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return result[0]
}

// Get user badges
export async function getUserBadges(userId: string) {
  return db
    .select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      awardedAt: userBadges.awardedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.awardedAt))
}

// Get user reputation
export async function getUserReputation(userId: string) {
  const result = await db
    .select({
      totalReputation: sql<number>`sum(${reputationEvents.delta})`,
    })
    .from(reputationEvents)
    .where(eq(reputationEvents.userId, userId))
    .groupBy(reputationEvents.userId)

  return result[0]?.totalReputation || 0
}

// Get user statistics
export async function getUserStats(userId: string) {
  const postCount = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.userId, userId))

  const threadCount = await db
    .select({ count: count() })
    .from(threads)
    .where(eq(threads.userId, userId))

  return {
    postCount: postCount[0]?.count || 0,
    threadCount: threadCount[0]?.count || 0,
  }
}

// Search users
export async function searchUsers(query: string, limit = 10) {
  return db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      displayUsername: users.displayUsername,
      image: users.image,
      role: users.role,
    })
    .from(users)
    .where(
      sql`(${users.name} ILIKE ${`%${query}%`} OR ${users.username} ILIKE ${`%${query}%`} OR ${
        users.displayUsername
      } ILIKE ${`%${query}%`})`
    )
    .limit(limit)
}

// Get recently joined users
export async function getRecentUsers(limit = 10) {
  return db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
}

// Update user profile
export async function updateUserProfile(userId: string, profileData: Partial<typeof userProfiles.$inferInsert>) {
  // Check if profile exists
  const existingProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1)

  if (existingProfile.length > 0) {
    // Update existing profile
    return db.update(userProfiles).set(profileData).where(eq(userProfiles.userId, userId))
  } else {
    // Create new profile
    return db.insert(userProfiles).values({
      userId,
      ...profileData,
    })
  }
}

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .orderBy(asc(users.username));
}