"use client";

import {
  Home,
  TrendingUp,
  Bookmark,
  Hash,
  Plus,
  MessageSquare,
  FileText,
  Mic,
  HelpCircle,
  Image,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Trending", url: "/trending", icon: TrendingUp },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
];

const topicItems = [
  { title: "Design", url: "/topics/design", icon: Hash },
  { title: "Technology", url: "/topics/technology", icon: Hash },
  { title: "Productivity", url: "/topics/productivity", icon: Hash },
  { title: "Future", url: "/topics/future", icon: Hash },
  { title: "Philosophy", url: "/topics/philosophy", icon: Hash },
];

const formatItems = [
  { title: "Threads", url: "/threads", icon: MessageSquare },
  { title: "Stories", url: "/stories", icon: FileText },
  { title: "AMAs", url: "/amas", icon: Mic },
  { title: "Questions", url: "/questions", icon: HelpCircle },
  { title: "Visuals", url: "/visuals", icon: Image },
];

export function AppSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const { state } = useSidebar();

  const iconSizeClass = state === "collapsed" ? "h-8 w-8" : "h-5 w-5";

  return (
    <Sidebar collapsible="icon" className="">
      {/**
       * SidebarHeader is now aware of the `state`.
       * When `state === "collapsed"`, we only show the avatar (or a generic icon for Guest).
       * When `state === "expanded"`, we show the full “avatar + username + toggle button.”
       */}
      <SidebarHeader className="px-4 py-8 flex justify-between">
        {isPending ? (
          // Still loading
          <div className="flex items-center gap-3">
            {state === "collapsed" ? (
              // In collapsed mode, show only a gray circle
              <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </>
            )}
          </div>
        ) : session?.user ? (
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={session.user.image || ""}
                  alt={`${session.user.username}'s avatar`}
                />
                <AvatarFallback>
                  {session.user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/*
                Only show the username text if the sidebar is expanded. 
                When collapsed, we omit the username entirely.
              */}
              {state === "expanded" && (
                <div>
                  <h3 className="font-semibold">{session.user.username}</h3>
                  {/* 
                    If you want to show email underneath, you can un-comment:
                    <p className="text-sm text-gray-500">{session.user.email}</p> 
                  */}
                </div>
              )}
            </div>

            {/*
              We always show the little “chevron” toggle button on the right,
              even when collapsed, so the user can expand it again.
            */}
            <SidebarTrigger />
          </div>
        ) : (
          // “Guest” view:
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-xs">?</span>
              </div>

              {/*
                Hide the “Guest / Not signed in” text when collapsed
              */}
              {state === "expanded" && (
                <div>
                  <h3 className="font-semibold">Guest</h3>
                  <p className="text-sm text-gray-500">Not signed in</p>
                </div>
              )}
            </div>

            <SidebarTrigger />
          </div>
        )}
      </SidebarHeader>

      {/** The rest of the sidebar groups stay the same **/}
      <SidebarContent className="">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={iconSizeClass} />
                      {state === "expanded" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Topics Section */}
        <SidebarGroup>
          <SidebarGroupLabel>TOPICS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {topicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={iconSizeClass} />
                      {state === "expanded" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* “Browse more” at the bottom of Topics */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/topics" className="flex items-center gap-3">
                    <Plus className={iconSizeClass} />
                    {state === "expanded" && (
                      <span className="font-medium">Browse more</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Formats Section */}
        <SidebarGroup>
          <SidebarGroupLabel>FORMATS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {formatItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={iconSizeClass} />
                      {state === "expanded" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
