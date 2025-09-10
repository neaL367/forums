"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ChevronDown, User, Settings, Bell, UserStar, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/components/header/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { stopImpersonationAction } from "@/actions/administrator/impersonate";

export function MemberMenu() {
  const { data: session, isPending } = authClient.useSession();

  const handleStopImpersonation = async () => {
    try {
      const result = await stopImpersonationAction();
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
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
          <div className="hidden lg:block h-6 w-6 rounded-full bg-zinc-700 animate-pulse"></div>
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
              <Avatar className="hidden lg:block">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={`${session.user.displayUsername}'s avatar`}
                  className="h-full w-full object-cover rounded-full"
                />
                <AvatarFallback className="h-full w-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-bold rounded-full flex items-center justify-center">
                  {session.user.displayUsername?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {session.user.displayUsername}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400 " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {session.user.displayUsername}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {session.user.role === "ADMINISTRATOR" && (
              <DropdownMenuItem asChild>
                <Link
                  href="/administrator/members-management"
                  className="flex items-center gap-2"
                >
                  <UserStar className="h-4 w-4" />
                  Administrator
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link
                href="/account-settings"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {session?.session?.impersonatedBy && (
              <DropdownMenuItem 
                onClick={handleStopImpersonation}
                className="flex items-center gap-2 cursor-pointer text-orange-600 hover:text-orange-700"
              >
                <UserX className="h-4 w-4" />
                Stop Impersonation
              </DropdownMenuItem>
            )}
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
  );
}
