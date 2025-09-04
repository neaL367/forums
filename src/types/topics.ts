export type Topics = {
  id: string
  title: string
  category: string
  author: string
  replies: number
  views: number
  lastReply?: {
    author: string
    date: string
  }
  isPinned: boolean
  isLocked: boolean
  status: "active" | "locked" | "pinned"
}