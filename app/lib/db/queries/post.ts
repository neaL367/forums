"use server"

import { db } from "@/db/db"
import { posts, threads, forums, users, attachments } from "@/db/schema"
import { eq, desc, sql, and, asc } from "drizzle-orm"

// Create a new post in a thread
export async function createPost(threadId: string, userId: string, content: string) {
  // Start a transaction
  return await db.transaction(async (tx) => {
    // Get thread info
    const [thread] = await tx
      .select()
      .from(threads)
      .where(eq(threads.id, threadId))
      .limit(1);

    if (!thread) {
      throw new Error("Thread not found");
    }

    if (thread.isLocked) {
      throw new Error("Thread is locked");
    }

    // Create post
    const [post] = await tx
      .insert(posts)
      .values({
        threadId,
        userId,
        content,
        createdAt: new Date(),
      })
      .returning();

    // Update thread stats
    await tx
      .update(threads)
      .set({
        postCount: sql`${threads.postCount} + 1`,
        lastPostAt: new Date(),
      })
      .where(eq(threads.id, threadId));

    // Update forum stats - with null check
    if (thread.forumId) {
      await tx
        .update(forums)
        .set({
          postCount: sql`${forums.postCount} + 1`,
          lastPostAt: new Date(),
        })
        .where(eq(forums.id, thread.forumId));
    }

    return post;
  });
}

// Update a post
export async function updatePost(postId: string, userId: string, content: string) {
  // Check if post exists and belongs to user
  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .limit(1)

  if (!post[0]) {
    throw new Error("Post not found or you don't have permission to edit it")
  }

  // Update post
  return db
    .update(posts)
    .set({
      content,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId))
    .returning()
}

// Delete a post (soft delete)
export async function deletePost(postId: string, userId: string, isAdmin = false) {
  // Check if post exists
  const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1)

  if (!post[0]) {
    throw new Error("Post not found")
  }

  // Check if user has permission to delete
  if (!isAdmin && post[0].userId !== userId) {
    throw new Error("You don't have permission to delete this post")
  }

  // Soft delete post
  return db
    .update(posts)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId))
}

// Get recent posts
export async function getRecentPosts(limit = 20) {
  return db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      thread: {
        id: threads.id,
        title: threads.title,
        forumId: threads.forumId,
      },
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(threads, eq(posts.threadId, threads.id))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.isDeleted, false))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
}

// Get post attachments
export async function getPostAttachments(postId: string) {
  return db
    .select()
    .from(attachments)
    .where(eq(attachments.postId, postId))
    .orderBy(asc(attachments.uploadedAt))
}

// Add attachment to post
export async function addAttachment(
  postId: string,
  userId: string,
  fileName: string,
  fileSize: number,
  mimeType: string,
  url: string
) {
  return db
    .insert(attachments)
    .values({
      id: crypto.randomUUID(),
      postId,
      uploaderId: userId,
      fileName,
      fileSize,
      mimeType,
      url,
      uploadedAt: new Date(),
    })
    .returning()
}
