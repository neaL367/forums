import { Suspense } from "react"
import { Folder, MessageSquare, MessageCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { DataTableSkeleton } from "@/features/administrator/shared/data-table/data-table-skeleton"

import { CategoriesDataTable } from "@/features/administrator/categories/categories-data-table-client"
import { ForumsDataTable } from "@/features/administrator/forums/forums-data-table-client"
import { TopicsDataTable } from "@/features/administrator/topics/topics-data-table-client"

import { categoriesColumns } from "@/features/administrator/categories/data/columns"
import { forumsColumns } from "@/features/administrator/forums/data/columns"
import { topicsColumns } from "@/features/administrator/topics/data/columns"

import type { Categories } from "@/types/categories"
import type { Forums } from "@/types/forums"
import type { Topics } from "@/types/topics"

interface ForumManagementTabsProps {
  categories: Categories[]
  forums: Forums[]
  topics: Topics[]
  stats: {
    categories: number
    forums: number
    topics: number
    totalReplies: number
  }
}

export function ForumManagementTabs({ categories, forums, topics, stats }: ForumManagementTabsProps) {
  return (
    <Tabs defaultValue="categories" className="space-y-4">
      <TabsList className="flex flex-wrap justify-between gap-2.5">
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Categories
          <Badge variant="secondary" className="ml-1">
            {stats.categories}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="forums" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Forums
          <Badge variant="secondary" className="ml-1">
            {stats.forums}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="topics" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Topics
          <Badge variant="secondary" className="ml-1">
            {stats.topics}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="categories" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Categories Management</CardTitle>
            <CardDescription>
              Manage forum categories and their associated forums. Categories serve as parent containers for organizing
              forums.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DataTableSkeleton />}>
              <CategoriesDataTable data={categories} columns={categoriesColumns} />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forums" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Forums Management</CardTitle>
            <CardDescription>
              Manage individual forums and subforums. Forums contain topics and discussions within specific categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DataTableSkeleton />}>
              <ForumsDataTable data={forums} columns={forumsColumns} />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="topics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Topics Management</CardTitle>
            <CardDescription>
              Manage discussion topics and their replies. Topics are individual discussion threads within forums.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DataTableSkeleton />}>
              <TopicsDataTable data={topics} columns={topicsColumns} />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
