export type UserRole = "Members" | "Administatrator" | "Moderator" |  "Staff"

export type User = {
  id: string
  createdAt: Date
  updatedAt: Date

  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: UserRole
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  username: string | null
  displayUsername: string | null
  
  sentMessages: PrivateMessage[]
  recvMessages: PrivateMessage[]
  posts: ForumPost[]
  votes: PollVote[]
  subscriptions: Subscription[]
  notifications: Notification[]
  favorites: Favorite[]
  repEvents: ReputationEvent[]
  badges: UserBadge[]
  reportsMade: Report[]
  reportsHandled: Report[]
  modLogs: ModerationLog[]
  UserProfile: UserProfile[]
}

export type SessionUser = Pick<
  User,
  "id" | "name" | "email" | "image" | "emailVerified"
>;


export type Category = {
  id: string
  name: string
  description: string | null
  display_order: number
  created_at: Date
}

export type Forum = {
  id: string
  category_id: number
  name: string
  description: string | null
  display_order: number
  created_at: Date
  last_post_at: Date | null
  thread_count: number
  post_count: number
}

export type Thread = {
  id: string
  forum_id: number
  user_id: number | null
  title: string
  is_sticky: boolean
  is_locked: boolean
  view_count: number
  created_at: Date
  last_post_at: Date | null
  post_count: number
}

export type ForumPost = {
  id: string
  thread_id: number
  user_id: number | null
  content: string
  created_at: Date
  updated_at: Date | null
  is_deleted: boolean
}

export type UserProfile = {
  user_id: number
  display_name: string | null
  signature: string | null
  location: string | null
  website: string | null
  bio: string | null
  join_date: Date
  birth_date: Date | null
}

export type PrivateMessage = {
  id: string
  sender_id: number | null
  recipient_id: number | null
  subject: string
  content: string
  is_read: boolean
  created_at: Date
}


export type Attachment = {
  id: string
  post_id: number
  uploader_id: number | null
  file_name: string
  file_size: number
  mime_type: string | null
  url: string
  uploaded_at: Date
}

export type Poll = {
  id: string
  thread_id: number
  question: string
  expires_at: Date | null
}

export type PollOption = {
  id: string
  poll_id: number
  option_text: string
  display_order: number
}

export type PollVote = {
  poll_id: number
  option_id: number
  user_id: number
  voted_at: Date
}

export type Subscription = {
  user_id: number
  thread_id: number
  subscribed_at: Date
}

export type Notification = {
  id: string
  user_id: number
  type: string                // e.g., 'NEW_POST', 'MENTION'
  reference_id: number | null // e.g., post_id or thread_id
  is_read: boolean
  created_at: Date
}

export type Favorite = {
  user_id: number
  thread_id: number | null
  post_id: number | null
  favorited_at: Date
}

export type ReputationEvent = {
  id: string
  user_id: number
  event_type: string          // e.g., 'POST_UPVOTE', 'ACCEPTED_ANSWER'
  delta: number               // e.g., +10, -2
  created_at: Date
}

export type Badge = {
  id: string
  name: string
  description: string | null
}

export type UserBadge = {
  user_id: number
  badge_id: number
  awarded_at: Date
}

export type Tag = {
  id: string
  name: string
}

export type ThreadTag = {
  thread_id: number
  tag_id: number
}

export type Report = {
  id: string
  reporter_id: number | null
  content_type: string,       // 'thread' or 'post'
  content_id: number
  reason: string | null
  created_at: Date
  handled_by: number | null
}

export type ModerationLog = {
  id: string
  moderator_id: number | null
  action: string              // e.g., 'POST_DELETED', 'USER_BANNED'
  target_type: string         // 'post', 'thread', 'user', etc.
  target_id: number | null
  created_at: Date
  notes: string | null
}