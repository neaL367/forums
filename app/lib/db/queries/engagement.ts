"use server"

import { db } from "@/db/db"
import { subscriptions, notifications, favorites, users, threads, posts, privateMessages } from "@/db/schema"
import { eq, desc, and, count } from "drizzle-orm"

// Subscribe to a thread
export async function subscribeToThread(userId: string, threadId: string) {
  // Check if already subscribed
  const existing = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.threadId, threadId)))
    .limit(1)

  if (existing.length > 0) {
    return existing[0]
  }

  // Create subscription
  return db
    .insert(subscriptions)
    .values({
      userId,
      threadId,
      subscribedAt: new Date(),
    })
    .returning()
}

// Unsubscribe from a thread
export async function unsubscribeFromThread(userId: string, threadId: string) {
  return db.delete(subscriptions).where(and(eq(subscriptions.userId, userId), eq(subscriptions.threadId, threadId)))
}

// Get user's subscribed threads
export async function getUserSubscriptions(userId: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  const subscribedThreads = await db
    .select({
      threadId: subscriptions.threadId,
      subscribedAt: subscriptions.subscribedAt,
      thread: {
        id: threads.id,
        title: threads.title,
        lastPostAt: threads.lastPostAt,
        postCount: threads.postCount,
      },
    })
    .from(subscriptions)
    .innerJoin(threads, eq(subscriptions.threadId, threads.id))
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(threads.lastPostAt))
    .limit(pageSize)
    .offset(offset)

  // Get total count for pagination
  const totalSubscriptions = await db
    .select({ count: count() })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))

  return {
    subscriptions: subscribedThreads,
    pagination: {
      total: totalSubscriptions[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalSubscriptions[0]?.count || 0) / pageSize),
    },
  }
}

// Add notification
export async function addNotification(userId: string, type: string, referenceId: string) {
  return db
    .insert(notifications)
    .values({
      id: crypto.randomUUID(),
      userId,
      type,
      referenceId,
      createdAt: new Date(),
    })
    .returning()
}

// Get user notifications
export async function getUserNotifications(userId: string, page = 1, pageSize = 20, unreadOnly = false) {
  const offset = (page - 1) * pageSize

  const query = db
    .select()
    .from(notifications)
    .where(
      unreadOnly 
        ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
        : eq(notifications.userId, userId)
    )

  const userNotifications = await query.orderBy(desc(notifications.createdAt)).limit(pageSize).offset(offset)

  // Get total count for pagination
  const countQuery = db.select({ count: count() }).from(notifications).where(
    unreadOnly
      ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      : eq(notifications.userId, userId)
  )
  const totalNotifications = await countQuery

  return {
    notifications: userNotifications,
    pagination: {
      total: totalNotifications[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalNotifications[0]?.count || 0) / pageSize),
    },
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  return db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(eq(notifications.id, notificationId))
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  return db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
}

// Add favorite
export async function addFavorite(userId: string, threadId: string, postId: string) {
  // Check if already favorited
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.threadId, threadId), eq(favorites.postId, postId)))
    .limit(1)

  if (existing.length > 0) {
    return existing[0]
  }

  // Create favorite
  return db
    .insert(favorites)
    .values({
      userId,
      threadId,
      postId,
      favoritedAt: new Date(),
    })
    .returning()
}

// Remove favorite
export async function removeFavorite(userId: string, threadId: string, postId: string) {
  return db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.threadId, threadId), eq(favorites.postId, postId)))
}

// Get user's favorites
export async function getUserFavorites(userId: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  const userFavorites = await db
    .select({
      favoritedAt: favorites.favoritedAt,
      thread: {
        id: threads.id,
        title: threads.title,
      },
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
      },
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(favorites)
    .innerJoin(threads, eq(favorites.threadId, threads.id))
    .innerJoin(posts, eq(favorites.postId, posts.id))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.favoritedAt))
    .limit(pageSize)
    .offset(offset)

  // Get total count for pagination
  const totalFavorites = await db.select({ count: count() }).from(favorites).where(eq(favorites.userId, userId))

  return {
    favorites: userFavorites,
    pagination: {
      total: totalFavorites[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalFavorites[0]?.count || 0) / pageSize),
    },
  }
}

// Send private message
export async function sendPrivateMessage(senderId: string, recipientId: string, subject: string, content: string) {
  return db
    .insert(privateMessages)
    .values({
      id: crypto.randomUUID(),
      senderId,
      recipientId,
      subject,
      content,
      createdAt: new Date(),
    })
    .returning()
}

// Get user's private messages
export async function getUserPrivateMessages(
  userId: string,
  folder: "inbox" | "sent" = "inbox",
  page = 1,
  pageSize = 20,
) {
  const offset = (page - 1) * pageSize

  const query = folder === "inbox" 
    ? db
        .select({
          id: privateMessages.id,
          subject: privateMessages.subject,
          content: privateMessages.content,
          isRead: privateMessages.isRead,
          createdAt: privateMessages.createdAt,
          otherUser: {
            id: users.id,
            name: users.name,
            username: users.username,
            image: users.image,
          },
        })
        .from(privateMessages)
        .innerJoin(users, eq(privateMessages.senderId, users.id))
        .where(eq(privateMessages.recipientId, userId))
    : db
        .select({
          id: privateMessages.id,
          subject: privateMessages.subject,
          content: privateMessages.content,
          isRead: privateMessages.isRead,
          createdAt: privateMessages.createdAt,
          otherUser: {
            id: users.id,
            name: users.name,
            username: users.username,
            image: users.image,
          },
        })
        .from(privateMessages)
        .innerJoin(users, eq(privateMessages.recipientId, users.id))
        .where(eq(privateMessages.senderId, userId));

  const messages = await query.orderBy(desc(privateMessages.createdAt)).limit(pageSize).offset(offset)

  // Get total count for pagination
  const [totalMessages] = await db
    .select({
      value: count().as('count')
    })
    .from(privateMessages)
    .where(
      folder === "inbox"
        ? eq(privateMessages.recipientId, userId)
        : eq(privateMessages.senderId, userId)
    );

  return {
    messages,
    pagination: {
      total: totalMessages.value || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalMessages.value || 0) / pageSize),
    },
  }
}

// Mark private message as read
export async function markMessageAsRead(messageId: string, userId: string) {
  return db
    .update(privateMessages)
    .set({
      isRead: true,
    })
    .where(and(eq(privateMessages.id, messageId), eq(privateMessages.recipientId, userId)))
}
