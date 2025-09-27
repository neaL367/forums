"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  MessageSquare,
  FileText,
  MessageCircle,
  Bug,
  BarChart3,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/administrator" as const, icon: BarChart3 },
  { name: "Members", href: "/administrator/members" as const, icon: User },
  {
    name: "Categories",
    href: "/administrator/categories" as const,
    icon: FolderTree,
  },
  {
    name: "Forums",
    href: "/administrator/forums" as const,
    icon: MessageSquare,
  },
  { name: "Topics", href: "/administrator/topics" as const, icon: FileText },
  {
    name: "Replies",
    href: "/administrator/replies" as const,
    icon: MessageCircle,
  },
  { name: "Reports", href: "/administrator/reports" as const, icon: Bug },
];

export function AdministratorSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent
            className={cn(
              `flex flex-col gap-6`,
              state === "collapsed" && "items-center duration-1000"
            )}
          >
            <SidebarTrigger />
            <SidebarMenu
              className={cn(
                `flex gap-2`,
                state === "collapsed" && "items-center duration-1000"
              )}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.href}
                        className={cn(`flex items-center gap-2`)}
                      >
                        <item.icon className="h-8 w-8" />
                        {state === "expanded" && (
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
