"use server"

import { db } from "@/db/db"
import { users, threads, reports, moderationLogs } from "@/db/schema"
import { eq, desc, count, isNull, not} from "drizzle-orm"

// Get all reports
export async function getReports(page = 1, pageSize = 20, status: "open" | "handled" | "all" = "open") {
  const offset = (page - 1) * pageSize;

  // Base query builder
  const baseQuery = db
    .select({
      id: reports.id,
      contentType: reports.contentType,
      contentId: reports.contentId,
      reason: reports.reason,
      createdAt: reports.createdAt,
      reporter: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
      handledBy: reports.handledBy,
    })
    .from(reports)
    .innerJoin(users, eq(reports.reporterId, users.id));

  // Add status condition if needed
  const whereCondition = status === "open" 
    ? isNull(reports.handledBy)
    : status === "handled"
    ? not(isNull(reports.handledBy))
    : undefined;

  // Execute query with conditions if any
  const reportsResult = whereCondition 
    ? await baseQuery
        .where(whereCondition)
        .orderBy(desc(reports.createdAt))
        .limit(pageSize)
        .offset(offset)
    : await baseQuery
        .orderBy(desc(reports.createdAt))
        .limit(pageSize)
        .offset(offset);

  // Count query with same conditions
  const countQuery = db.select({ 
    count: count().as("count") 
  }).from(reports);

  const [totalReports] = whereCondition 
    ? await countQuery.where(whereCondition)
    : await countQuery;

  return {
    reports: reportsResult,
    pagination: {
      total: totalReports?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalReports?.count || 0) / pageSize),
    },
  };
}

// Handle a report
export async function handleReport(reportId: string, moderatorId: string, action: string, notes?: string) {
  return await db.transaction(async (tx) => {
    // Mark report as handled
    const [report] = await tx
      .update(reports)
      .set({
        handledBy: moderatorId,
      })
      .where(eq(reports.id, reportId))
      .returning()

    // Log the moderation action
    await tx.insert(moderationLogs).values({
      id: crypto.randomUUID(),
      moderatorId,
      action,
      targetType: report.contentType,
      targetId: report.contentId,
      notes,
      createdAt: new Date(),
    })

    return report
  })
}

// Ban a user
export async function banUser(
  userId: string,
  moderatorId: string,
  reason: string,
  duration?: { days: number } | null
) {
  return await db.transaction(async (tx) => {
    let banExpires = null
    if (duration) {
      banExpires = new Date()
      banExpires.setDate(banExpires.getDate() + duration.days)
    }

    // Ban the user
    const [user] = await tx
      .update(users)
      .set({
        banned: true,
        banReason: reason,
        banExpires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    // Log the moderation action
    await tx.insert(moderationLogs).values({
      id: crypto.randomUUID(),
      moderatorId,
      action: duration ? `Temporary ban (${duration.days} days)` : "Permanent ban",
      targetType: "user",
      targetId: userId,
      notes: reason,
      createdAt: new Date(),
    })

    return user
  })
}

// Unban a user
export async function unbanUser(userId: string, moderatorId: string, notes?: string) {
  return await db.transaction(async (tx) => {
    // Unban the user
    const [user] = await tx
      .update(users)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    // Log the moderation action
    await tx.insert(moderationLogs).values({
      id: crypto.randomUUID(),
      moderatorId,
      action: "Unban",
      targetType: "user",
      targetId: userId,
      notes,
      createdAt: new Date(),
    })

    return user
  })
}

// Lock a thread
export async function lockThread(threadId: string, moderatorId: string, notes?: string) {
  return await db.transaction(async (tx) => {
    // Lock the thread
    const [thread] = await tx
      .update(threads)
      .set({
        isLocked: true,
      })
      .where(eq(threads.id, threadId))
      .returning()

    // Log the moderation action
    await tx.insert(moderationLogs).values({
      id: crypto.randomUUID(),
      moderatorId,
      action: "Lock thread",
      targetType: "thread",
      targetId: threadId,
      notes,
      createdAt: new Date(),
    })

    return thread
  })
}

// Get moderation logs
export async function getModerationLogs(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  const logs = await db
    .select({
      id: moderationLogs.id,
      action: moderationLogs.action,
      targetType: moderationLogs.targetType,
      targetId: moderationLogs.targetId,
      notes: moderationLogs.notes,
      createdAt: moderationLogs.createdAt,
      moderator: {
        id: users.id,
        name: users.name,
        username: users.username,
      },
    })
    .from(moderationLogs)
    .innerJoin(users, eq(moderationLogs.moderatorId, users.id))
    .orderBy(desc(moderationLogs.createdAt))
    .limit(pageSize)
    .offset(offset)

  // Get total count for pagination
  const totalLogs = await db.select({ count: count() }).from(moderationLogs)

  return {
    logs,
    pagination: {
      total: totalLogs[0]?.count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((totalLogs[0]?.count || 0) / pageSize),
    },
  }
}
