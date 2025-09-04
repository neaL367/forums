export type Reports = {
  id: string
  type: "bug" | "request"
  title: string
  author: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  assignedTo?: string
}
