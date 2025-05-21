"use server"

import { db } from "@/db/db"
import { categories, forums, threads, posts, users, tags, threadTags } from "@/db/schema"
import { eq, desc, sql, count, asc } from "drizzle-orm"

// Get all categories with forums
export async function getAllCategories() {
  const categoriesWithForums = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      displayOrder: categories.displayOrder,
    })
    .from(categories)
    .orderBy(asc(categories.displayOrder))

  const result = []

  for (const category of categoriesWithForums) {
    const categoryForums = await db
      .select({
        id: forums.id,
        name: forums.name,
        description: forums.description,
        displayOrder: forums.displayOrder,
        threadCount: forums.threadCount,
        postCount: forums.postCount,
        lastPostAt: forums.lastPostAt,
      })
      .from(forums)
      .where(eq(forums.categoryId, category.id))
      .orderBy(asc(forums.displayOrder))

    result.push({
      ...category,
      forums: categoryForums,
    })
  }

  return result
}

// Get forum by ID with threads
export async function getForumById(forumId: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  const forum = await db
    .select()
    .from(forums)
    .where(eq(forums.id, forumId))
    .limit(1)

  if (!forum[0]) {
    return null
  }

  const forumThreads = await db
    .select({
      id: threads.id,
      title: threads.title,
      isSticky: threads.isSticky,
      isLocked: threads.isLocked,
      viewCount: threads.viewCount,
      createdAt: threads.createdAt,
      lastPostAt: threads.lastPostAt,
      postCount: threads.postCount,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(eq(threads.forumId, forumId))
    .orderBy(desc(threads.isSticky), desc(threads.lastPostAt))
    .limit(pageSize)
    .offset(offset)

  // Get total thread count for pagination
  const totalThreads = await db
    .select({ count: count() })
    .from(threads)
    .where(eq(threads.forumId, forumId))

  return {
    ...forum[0],
    threads: forumThreads,
    pagination: {
      total: totalThreads[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalThreads[0]?.count || 0) / pageSize),
    },
  }
}

// Get thread by ID with posts
export async function getThreadById(threadId: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  const thread = await db
    .select({
      id: threads.id,
      title: threads.title,
      forumId: threads.forumId,
      isSticky: threads.isSticky,
      isLocked: threads.isLocked,
      viewCount: threads.viewCount,
      createdAt: threads.createdAt,
      lastPostAt: threads.lastPostAt,
      postCount: threads.postCount,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(eq(threads.id, threadId))
    .limit(1)

  if (!thread[0]) {
    return null
  }

  // Get thread tags
  const threadTagsResult = await db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(threadTags)
    .innerJoin(tags, eq(threadTags.tagId, tags.id))
    .where(eq(threadTags.threadId, threadId))

  // Get thread posts
  const threadPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      isDeleted: posts.isDeleted,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.threadId, threadId))
    .orderBy(asc(posts.createdAt))
    .limit(pageSize)
    .offset(offset)

  // Get total post count for pagination
  const totalPosts = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.threadId, threadId))

  // Increment view count
  await db
    .update(threads)
    .set({
      viewCount: sql`${threads.viewCount} + 1`,
    })
    .where(eq(threads.id, threadId))

  return {
    ...thread[0],
    tags: threadTagsResult,
    posts: threadPosts,
    pagination: {
      total: totalPosts[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalPosts[0]?.count || 0) / pageSize),
    },
  }
}

// Create new thread
export async function createThread(
  forumId: string,
  userId: string,
  title: string,
  content: string,
  tagIds: string[] = []
) {
  // Start a transaction
  return await db.transaction(async (tx) => {
    // Create thread
    const [thread] = await tx
      .insert(threads)
      .values({
        id: crypto.randomUUID(),
        forumId,
        userId,
        title,
        createdAt: new Date(),
        lastPostAt: new Date(),
      })
      .returning()

    // Create first post
    const [post] = await tx
      .insert(posts)
      .values({
        id: crypto.randomUUID(),
        threadId: thread.id,
        userId,
        content,
        createdAt: new Date(),
      })
      .returning()

    // Add tags if provided
    if (tagIds.length > 0) {
      const tagValues = tagIds.map((tagId) => ({
        threadId: thread.id,
        tagId,
      }))
      await tx.insert(threadTags).values(tagValues)
    }

    // Update forum stats
    await tx
      .update(forums)
      .set({
        threadCount: sql`${forums.threadCount} + 1`,
        postCount: sql`${forums.postCount} + 1`,
        lastPostAt: new Date(),
      })
      .where(eq(forums.id, forumId))

    return { thread, post }
  })
}

// Search threads
export async function searchThreads(query: string, limit = 20) {
  return db
    .select({
      id: threads.id,
      title: threads.title,
      forumId: threads.forumId,
      createdAt: threads.createdAt,
      lastPostAt: threads.lastPostAt,
      postCount: threads.postCount,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(threads)
    .innerJoin(users, eq(threads.userId, users.id))
    .where(sql`${threads.title} ILIKE ${`%${query}%`}`)
    .orderBy(desc(threads.lastPostAt))
    .limit(limit)
}
