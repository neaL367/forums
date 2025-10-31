import {
  FolderTree,
  MessageSquare,
  FileText,
  MessageCircle,
  Bug,
  Users,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdministratorHeader } from "@/features/administrator/shared/admnistrator-header-client";

const stats = [
  {
    title: "Total Categories",
    value: "12",
    change: "+2 this month",
    icon: FolderTree,
    color: "text-blue-500",
  },
  {
    title: "Active Forums",
    value: "48",
    change: "+5 this week",
    icon: MessageSquare,
    color: "text-green-500",
  },
  {
    title: "Topics Created",
    value: "1,234",
    change: "+89 today",
    icon: FileText,
    color: "text-purple-500",
  },
  {
    title: "Total Replies",
    value: "5,678",
    change: "+234 today",
    icon: MessageCircle,
    color: "text-orange-500",
  },
  {
    title: "Open Reports",
    value: "23",
    change: "-5 resolved",
    icon: Bug,
    color: "text-red-500",
  },
  {
    title: "Active Users",
    value: "892",
    change: "+12 online",
    icon: Users,
    color: "text-cyan-500",
  },
];

const recentActivity = [
  {
    type: "forum",
    title: "New forum created: 'Technical Support'",
    time: "2 minutes ago",
    status: "success",
  },
  {
    type: "report",
    title: "Bug report resolved: 'Login issue'",
    time: "15 minutes ago",
    status: "resolved",
  },
  {
    type: "topic",
    title: "High activity topic: 'Feature Requests'",
    time: "1 hour ago",
    status: "trending",
  },
  {
    type: "user",
    title: "New moderator assigned to 'General Discussion'",
    time: "3 hours ago",
    status: "info",
  },
];

export default function AdministratorOverview() {
  return (
    <>
      <AdministratorHeader
        breadcrumbs={[
          { label: "Administrator", href: "/administrator" },
          { label: "Overview" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 pt-0 pb-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage your forum community
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates across your forum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "resolved"
                            ? "secondary"
                            : activity.status === "trending"
                              ? "destructive"
                              : "outline"
                      }
                      className="ml-2"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">
                        Create New Category
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Add a new forum category
                      </p>
                    </div>
                    <FolderTree className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">
                        Moderate Reports
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Review pending reports
                      </p>
                    </div>
                    <Bug className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-accent-foreground">
                        User Management
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Manage user permissions
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
