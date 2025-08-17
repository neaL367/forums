"use client"

import Link from "next/link"
import { ChevronDown, User, Settings, Bell, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/header/signout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <div className="flex items-center gap-3">
      {/* Notification bell */}
      <Button size="sm" variant="ghost" className="relative h-8 w-8 text-zinc-400 hover:text-white">
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
                <AvatarImage src={session.user.image || ""} alt={`${session.user.displayUsername}'s avatar`} />
                <AvatarFallback>{session.user.displayUsername?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{session.user.displayUsername}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{session.user.displayUsername}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/profile/${session.user.id}`} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {session.user.role === "ADMINISTRATOR" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/account-settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account Settings
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
          <Link href="/sign-in">{isPending ? "Loading..." : "Sign In"}</Link>
        </Button>
      )}
    </div>
  )
}
