"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, User, Lock, Mail, ChartBar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navItems = [
  { href: "/account-settings", label: "Overview", icon: ChartBar },
  { href: "/account-settings/username", label: "Username", icon: User },
  { href: "/account-settings/password", label: "Password", icon: Lock },
  { href: "/account-settings/email", label: "Email", icon: Mail },
];

export default function AccountSettingsSidebar() {
  const pathname = usePathname();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  isActive
                    ? "bg-muted text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
