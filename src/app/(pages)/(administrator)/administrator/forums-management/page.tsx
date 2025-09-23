import { getAllCategories } from "@/database/categories"
import { getAllForums } from "@/database/forums"
import { getAllTopics } from "@/database/topics"
import { getAllReplies } from "@/database/replies"

import { ForumStatsCards } from "@/features/administrator/shared/forum-stats-card"
import { ForumManagementTabs } from "@/features/administrator/shared/forum-management-tabs"

export default async function ForumManagementPage() {
  const [categories, forums, topics, replies] = await Promise.all([
    getAllCategories(),
    getAllForums(),
    getAllTopics(),
    getAllReplies(),
  ])

  const stats = {
    categories: categories.length,
    forums: forums.length,
    topics: topics.length,
    totalReplies: replies.length,
  }

  return (
    <div className="mx-auto space-y-6">
      <ForumStatsCards stats={stats} />
      <ForumManagementTabs categories={categories} forums={forums} topics={topics} stats={stats} />
    </div>
  )
}
