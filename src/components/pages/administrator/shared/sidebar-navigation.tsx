"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings as SettingsIcon,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Member & Roles Management",
    href: "/administrator/members" as const,
    icon: Users,
  },
  {
    label: "Forum & topics Management",
    href: "/administrator/forums-topics" as const,
    icon: Folder,
  },
  {
    label: "Reports & Features",
    href: "/administrator/reports" as const,
    icon: SettingsIcon,
  },
];

export default function AdministratorSidebar() {
  const pathname = usePathname();

  return (
    <Card className="sticky top-24 from-primary/5 to-card bg-gradient-to-t dark:bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Administrator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link key={label} href={href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 truncate",
                  isActive
                    ? "bg-muted text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="w-4 h-4 hidden lg:block" />
                {label}
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
