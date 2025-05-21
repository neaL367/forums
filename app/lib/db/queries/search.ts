"use server"

import { db } from "@/db/db"
import { users, threads, posts, forums, threadTags } from "@/db/schema"
import { eq, desc, sql, and, count, or, asc, inArray } from "drizzle-orm"

// Comprehensive search across multiple entities
export async function searchAll(query: string, limit = 20) {
  // Search threads
  const threadResults = await db
    .select({
      id: threads.id,
      title: threads.title,
      type: sql<string>`'thread'`.as("type"),
      createdAt: threads.createdAt,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(sql`${threads.title} ILIKE ${`%${query}%`}`)
    .limit(limit)

  // Search posts
  const postResults = await db
    .select({
      id: posts.id,
      content: posts.content,
      type: sql<string>`'post'`.as("type"),
      createdAt: posts.createdAt,
      threadId: posts.threadId,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(sql`${posts.content} ILIKE ${`%${query}%`}`)
    .limit(limit)

  // Search users
  const userResults = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      type: sql<string>`'user'`.as("type"),
      createdAt: users.createdAt,
    })
    .from(users)
    .where(or(sql`${users.name} ILIKE ${`%${query}%`}`, sql`${users.username} ILIKE ${`%${query}%`}`))
    .limit(limit)

  // Combine results
  return {
    threads: threadResults,
    posts: postResults,
    users: userResults,
  }
}

// Advanced thread search with filters
export async function advancedThreadSearch({
  query,
  forumId,
  authorId,
  tags,
  dateFrom,
  dateTo,
  sortBy = "recent",
  page = 1,
  pageSize = 20,
}: {
  query?: string
  forumId?: string
  authorId?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  sortBy?: "recent" | "views" | "replies"
  page?: number
  pageSize?: number
}) {
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [];

  if (query) {
    conditions.push(sql`${threads.title} ILIKE ${`%${query}%`}`);
  }

  if (forumId) {
    conditions.push(eq(threads.forumId, forumId));
  }

  if (authorId) {
    conditions.push(eq(threads.userId, authorId));
  }

  if (dateFrom) {
    conditions.push(sql`${threads.createdAt} >= ${dateFrom}`);
  }

  if (dateTo) {
    conditions.push(sql`${threads.createdAt} <= ${dateTo}`);
  }

  // Build base query
  const baseQuery = db
    .select({
      id: threads.id,
      title: threads.title,
      forumId: threads.forumId,
      isSticky: threads.isSticky,
      isLocked: threads.isLocked,
      viewCount: threads.viewCount,
      postCount: threads.postCount,
      createdAt: threads.createdAt,
      lastPostAt: threads.lastPostAt,
      forum: {
        id: forums.id,
        name: forums.name,
      },
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .innerJoin(forums, eq(threads.forumId, forums.id));

  // Apply conditions and execute query
  const finalQuery = conditions.length > 0
    ? baseQuery.where(and(...conditions))
    : baseQuery;

  // Apply sorting
  const sortedQuery = sortBy === "views"
    ? finalQuery.orderBy(desc(threads.viewCount))
    : sortBy === "replies"
    ? finalQuery.orderBy(desc(threads.postCount))
    : finalQuery.orderBy(desc(threads.lastPostAt));

  // Execute query with pagination
  const results = await sortedQuery.limit(pageSize).offset(offset);

  // Get total count with proper alias
  const [totalCount] = await db
    .select({ count: count().as("count") })
    .from(threads)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // Handle tags filtering
  let filteredResults = results;
  if (tags?.length) {
    const threadIds = results.map(thread => thread.id);
    
    // Get threads with matching tags using prepared statement
    const threadsWithTags = await db
      .selectDistinct({
        threadId: threadTags.threadId,
      })
      .from(threadTags)
      .where(
        and(
          inArray(threadTags.threadId, threadIds),
          inArray(threadTags.tagId, tags)
        )
      );

    const threadIdsWithTags = threadsWithTags.map(t => t.threadId);
    filteredResults = results.filter(thread => 
      threadIdsWithTags.includes(thread.id)
    );
  }

  return {
    threads: filteredResults,
    pagination: {
      total: totalCount?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalCount?.count || 0) / pageSize),
    },
  };
}
// Search posts within a thread
export async function searchPostsInThread(threadId: string, query: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;

  const postResults = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(and(eq(posts.threadId, threadId), sql`${posts.content} ILIKE ${`%${query}%`}`))
    .orderBy(asc(posts.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [totalPosts] = await db
    .select({ count: count().as("count") })
    .from(posts)
    .where(and(eq(posts.threadId, threadId), sql`${posts.content} ILIKE ${`%${query}%`}`));

  return {
    posts: postResults,
    pagination: {
      total: totalPosts?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalPosts?.count || 0) / pageSize),
    },
  };
}
