"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FileText,
  MessageCircle,
  Bug,
  BarChart3,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

const navigation: {
  name: string;
  href: string;
  icon: LucideIcon;
  items?: { name: string; href: string }[];
}[] = [
  {
    name: "Overview",
    href: "/administrator",
    icon: BarChart3,
  },
  {
    name: "Members",
    href: "/administrator/members",
    icon: User,
  },
  {
    name: "Forums",
    href: "/administrator/forums",
    icon: MessageSquare,
  },
  {
    name: "Topics",
    href: "/administrator/topics",
    icon: FileText,
  },
  {
    name: "Replies",
    href: "/administrator/replies",
    icon: MessageCircle,
  },
  {
    name: "Reports",
    href: "/administrator/reports",
    icon: Bug,
  },
];

export function AdministratorSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.name}
                  asChild
                  defaultOpen={pathname.startsWith(item.href)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.name}
                      >
                        <Link href={{ pathname: item.href }}>
                          <item.icon />
                          <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.name}>
                            <SidebarMenuSubButton asChild>
                              <Link href={{ pathname: sub.href }}>
                                <span className="group-data-[collapsible=icon]:hidden">{sub.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Regular single item
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={{ pathname: item.href }}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}