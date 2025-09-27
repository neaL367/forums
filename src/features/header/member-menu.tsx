"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import {
  ChevronDown,
  User,
  Settings,
  Bell,
  UserStar,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/features/header/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stopImpersonationAction } from "@/actions/administrator/members/impersonate";
import { Member, Session } from "@/lib/auth";

interface MemberMenuProps {
  member?: Member;
  session?: Session | null;
}

export function MemberMenu({ member, session }: MemberMenuProps) {
  const [open, setOpen] = useState(false);

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

      {/* User Avatar Dropdown or Sign In */}
      {member ? (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 text-white hover:bg-black dark:hover:bg-black"
            >
              <Avatar className="hidden lg:block">
                <AvatarImage
                  src={member.image || ""}
                  alt={`${member.displayUsername}'s avatar`}
                  className="h-full w-full object-cover rounded-full"
                />
                <AvatarFallback className="h-full w-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-bold rounded-full flex items-center justify-center">
                  {member.displayUsername?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {member.displayUsername}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{member.displayUsername}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/profile/${member.id}`}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {member.role === "ADMINISTRATOR" && (
              <DropdownMenuItem asChild>
                <Link
                  href="/administrator"
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

            {session?.session.impersonatedBy && (
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
        <Button variant="outline" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
