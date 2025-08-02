import Link from "next/link";
import { Settings, User, Lock, Mail, ChartBar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Layout({
  children,
  username,
  email,
  password,
}: {
  children: React.ReactNode;
  username: React.ReactNode;
  email: React.ReactNode;
  password: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl min-h-[calc(100dvh)] my-10 mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Account Settings
        </h1>
        <p className="text-zinc-300">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/account-settings">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <ChartBar className="w-4 h-4" />
                  Overview
                </Button>
              </Link>
              <Link href="/account-settings/username">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Button>
              </Link>
              <Link href="/account-settings/password">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Button>
              </Link>
              <Link href="/account-settings/email">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          {username}
          {children}
          {email}
          {password}
        </div>
      </div>
    </div>
  );
}
