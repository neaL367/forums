import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users and Profiles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  role: text("role", { enum: ["Members", "Administrator", "Moderator", "Staff"] }).default("Members"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
});

export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").references(() => users.id).primaryKey(),
  displayName: text("display_name"),
  signature: text("signature"),
  location: text("location"),
  website: text("website"),
  bio: text("bio"),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  birthDate: timestamp("birth_date"),
});

// Forums Structure
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const forums = pgTable("forums", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastPostAt: timestamp("last_post_at"),
  threadCount: integer("thread_count").notNull().default(0),
  postCount: integer("post_count").notNull().default(0),
});

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  forumId: uuid("forum_id").references(() => forums.id),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  isSticky: boolean("is_sticky").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastPostAt: timestamp("last_post_at"),
  postCount: integer("post_count").notNull().default(0),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id").references(() => threads.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").default(false),
});

// Messaging System
export const privateMessages = pgTable("private_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => users.id),
  recipientId: uuid("recipient_id").references(() => users.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Attachments
export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => posts.id),
  uploaderId: uuid("uploader_id").references(() => users.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type"),
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Polling System
export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id").references(() => threads.id),
  question: text("question").notNull(),
  expiresAt: timestamp("expires_at"),
});

export const pollOptions = pgTable("poll_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").references(() => polls.id),
  optionText: text("option_text").notNull(),
  displayOrder: integer("display_order").notNull(),
});

export const pollVotes = pgTable("poll_votes", {
  pollId: uuid("poll_id").references(() => polls.id),
  optionId: uuid("option_id").references(() => pollOptions.id),
  userId: uuid("user_id").references(() => users.id),
  votedAt: timestamp("voted_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.pollId, table.userId] }),
}));

// User Engagement
export const subscriptions = pgTable("subscriptions", {
  userId: uuid("user_id").references(() => users.id),
  threadId: uuid("thread_id").references(() => threads.id),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.threadId] }),
}));

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  type: text("type").notNull(),
  referenceId: uuid("reference_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  userId: uuid("user_id").references(() => users.id),
  threadId: uuid("thread_id").references(() => threads.id),
  postId: uuid("post_id").references(() => posts.id),
  favoritedAt: timestamp("favorited_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.threadId, table.postId] }),
}));

// Reputation System
export const reputationEvents = pgTable("reputation_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  delta: integer("delta").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Badge System
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
});

export const userBadges = pgTable("user_badges", {
  userId: uuid("user_id").references(() => users.id),
  badgeId: uuid("badge_id").references(() => badges.id),
  awardedAt: timestamp("awarded_at").notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.badgeId] }),
}));

// Tagging System
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const threadTags = pgTable("thread_tags", {
  threadId: uuid("thread_id").references(() => threads.id),
  tagId: uuid("tag_id").references(() => tags.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.threadId, table.tagId] }),
}));

// Moderation System
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").references(() => users.id),
  contentType: text("content_type").notNull(),
  contentId: uuid("content_id").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  handledBy: uuid("handled_by").references(() => users.id),
});

export const moderationLogs = pgTable("moderation_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  moderatorId: uuid("moderator_id").references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  notes: text("notes"),
});

// Authentication Tables
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  threads: many(threads),
  sentMessages: many(privateMessages, { relationName: "sender" }),
  receivedMessages: many(privateMessages, { relationName: "recipient" }),
  profile: many(userProfiles),
  pollVotes: many(pollVotes),
  subscriptions: many(subscriptions),
  notifications: many(notifications),
  favorites: many(favorites),
  repEvents: many(reputationEvents),
  badges: many(userBadges),
  reportsMade: many(reports, { relationName: "reporter" }),
  reportsHandled: many(reports, { relationName: "handler" }),
  modLogs: many(moderationLogs),
}));


export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Forum = typeof forums.$inferSelect;
export type Thread = typeof threads.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type VerificationToken = typeof verification.$inferSelect;
export type NewVerificationToken = typeof verification.$inferInsert;


export const schema = {
  users,
  userProfiles,
  categories,
  forums,
  threads,
  posts,
  privateMessages,
  attachments,
  polls,
  pollOptions,
  pollVotes,
  subscriptions,
  notifications,
  favorites,
  reputationEvents,
  badges,
  userBadges,
  tags,
  threadTags,
  reports,
  moderationLogs,
  sessions,
  accounts,
  verification,
};