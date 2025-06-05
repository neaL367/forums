"use client";

import Link from "next/link";
import { Search, ChevronDown, User, Settings, Bell } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/components/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 w-full bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        {/* Left side - Logo and title */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              Forum
            </span>
            <span className="text-xs text-zinc-400">2025</span>
          </div>
        </Link>

        {/* Center - Search */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search forums, members, or topics..."
            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side - Notifications and User Avatar */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <Button
            size="sm"
            variant="ghost"
            className="relative h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar Dropdown or Loading/Sign In */}
          {isPending ? (
            <div className="flex items-center gap-2 h-8 px-2">
              <div className="h-6 w-6 rounded-full bg-zinc-700 animate-pulse"></div>
              <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse"></div>
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-8 px-2 text-white hover:bg-zinc-800"
                  disabled={isPending}
                >
                  <Avatar>
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={`${session.user.username}'s avatar`}
                    />
                    <AvatarFallback>
                      {session.user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {session.user.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm font-medium">
                      {session.user.username}
                    </p>
                    {/* <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild disabled={isPending}>
              <Link href="/sign-in">
                {isPending ? "Loading..." : "Sign In"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
