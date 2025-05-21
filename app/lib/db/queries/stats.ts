"use server"

import { db } from "@/db/db"
import { 
  users, 
  posts, 
  threads, 
  forums, 
  categories,
  sessions
} from "@/db/schema"
import { eq, desc, sql, count, sum, gt } from "drizzle-orm"
import type { SQL } from 'drizzle-orm';

// Get forum statistics
export async function getForumStats() {
  const userCount = await db.select({ count: count() }).from(users)
  const threadCount = await db.select({ count: count() }).from(threads)
  const postCount = await db.select({ count: count() }).from(posts)
  
  // Get newest user
  const newestUser = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(1)

  // Get active users (users with sessions in the last 15 minutes)
  const fifteenMinutesAgo = new Date()
  fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)
  
  const activeUsers = await db
    .select({ count: count() })
    .from(sessions)
    .where(gt(sessions.updatedAt, fifteenMinutesAgo))

  return {
    totalUsers: userCount[0]?.count || 0,
    totalThreads: threadCount[0]?.count || 0,
    totalPosts: postCount[0]?.count || 0,
    newestUser: newestUser[0] || null,
    activeUsers: activeUsers[0]?.count || 0,
  }
}

// Get most active users
export async function getMostActiveUsers(limit = 10, period: "day" | "week" | "month" | "all" = "all") {
  const now = new Date();
  let dateCondition: SQL<unknown> | undefined;
  
  if (period === "day") {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    dateCondition = gt(posts.createdAt, yesterday);
  } else if (period === "week") {
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    dateCondition = gt(posts.createdAt, lastWeek);
  } else if (period === "month") {
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    dateCondition = gt(posts.createdAt, lastMonth);
  }

  const baseQuery = db
    .select({
      userId: posts.userId,
      postCount: count(posts.id),
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id));
    
  const query = dateCondition 
    ? baseQuery.where(dateCondition)
    : baseQuery;
    
  return query
    .groupBy(posts.userId, users.id, users.name, users.username, users.image)
    .orderBy(desc(sql`count(${posts.id})`))
    .limit(limit);
}

// Get most viewed threads
export async function getMostViewedThreads(limit = 10) {
  return db
    .select({
      id: threads.id,
      title: threads.title,
      viewCount: threads.viewCount,
      postCount: threads.postCount,
      createdAt: threads.createdAt,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .orderBy(desc(threads.viewCount))
    .limit(limit)
}

// Get forum activity by time period
export async function getForumActivity(
  period: "daily" | "weekly" | "monthly" = "daily",
  limit = 30
) {
  const groupBy = period === "daily"
    ? sql`date_trunc('day', ${posts.createdAt})`
    : period === "weekly"
    ? sql`date_trunc('week', ${posts.createdAt})`
    : sql`date_trunc('month', ${posts.createdAt})`;

  return db
    .select({
      date: groupBy,
      postCount: count(posts.id),
    })
    .from(posts)
    .groupBy(groupBy)
    .orderBy(desc(groupBy))
    .limit(limit);
}

// Get category activity distribution
export async function getCategoryActivity() {
  return db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      threadCount: count(threads.id),
      postCount: sum(forums.postCount),
    })
    .from(categories)
    .leftJoin(forums, eq(categories.id, forums.categoryId))
    .leftJoin(threads, eq(forums.id, threads.forumId))
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`sum(${forums.postCount})`))
}

// Get user registration trends
export async function getUserRegistrationTrends(
  period: "daily" | "weekly" | "monthly" = "monthly",
  limit = 12
) {
  const groupBy = period === "daily"
    ? sql`date_trunc('day', ${users.createdAt})`
    : period === "weekly"
    ? sql`date_trunc('week', ${users.createdAt})`
    : sql`date_trunc('month', ${users.createdAt})`;

  return db
    .select({
      date: groupBy,
      userCount: count(users.id),
    })
    .from(users)
    .groupBy(groupBy)
    .orderBy(desc(groupBy))
    .limit(limit);
}
