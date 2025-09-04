export type Forums = {
  id: string
  title: string
  description: string
  topicCount: number
  postCount: number
  lastPost?: {
    topicTitle: string
    author: string
    date: string
  }
  isVisible: boolean
}