"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Members } from "@/types/member";
import { impersonateMemberAction } from "@/actions/administrator/impersonate";
import { removeMemberAction } from "@/actions/administrator/member";
import { banMemberAction, unbanMemberAction } from "@/actions/administrator/ban";
import { revokeAllSessionsMemberAction } from "@/actions/administrator/revoke";
import { UserSession } from "@/types/sessions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MemberActionsDropdownProps {
  member: Members;
  session: UserSession;
  onEdit: () => void;
  onSetRole: () => void;
  onSetPassword: () => void;
  onManageSessions: () => void;
  onDataUpdate: Dispatch<SetStateAction<Members[]>>;
}

export function MemberActionsDropdown({
  member,
  session,
  onEdit,
  onSetRole,
  onSetPassword,
  onManageSessions,
  onDataUpdate,
}: MemberActionsDropdownProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case "edit":
          onEdit();
          break;
        case "setRole":
          onSetRole();
          break;
        case "setPassword":
          onSetPassword();
          break;
        case "revokeSessions":
          onManageSessions();
          break;
        case "impersonate":
          if (session?.userId === member.id) {
            toast.error("Cannot impersonate yourself");
            return;
          }
          const impersonateResult = await impersonateMemberAction(member.id);
          if (impersonateResult.success) {
            toast.success(impersonateResult.message);
            window.location.reload();
          } else {
            toast.error(impersonateResult.message);
          }
          break;
        case "revokeAll":
          const revokeResult = await revokeAllSessionsMemberAction(member.id);
          if (revokeResult.success) {
            toast.success(revokeResult.message);
          } else {
            toast.error(revokeResult.message);
          }
          break;
        case "ban":
          const banResult = member.banned 
            ? await unbanMemberAction(member.id)
            : await banMemberAction(member.id);
          if (banResult.success) {
            toast.success(banResult.message);
            onDataUpdate(prev => prev.map(m => 
              m.id === member.id ? { ...m, banned: !m.banned } : m
            ));
          } else {
            toast.error(banResult.message);
          }
          break;
        case "remove":
          if (session?.userId === member.id) {
            toast.error("Cannot remove yourself");
            return;
          }
          setShowRemoveDialog(true);
          break;
      }
    } catch  {
      toast.error("An unexpected error occurred");
    }
  };

  const handleRemoveMember = async () => {
    try {
      const removeResult = await removeMemberAction(member.id);
      if (removeResult.success) {
        toast.success(removeResult.message);
        onDataUpdate(prev => prev.filter(m => m.id !== member.id));
      } else {
        toast.error(removeResult.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setShowRemoveDialog(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/profile/${member.id}`}>View Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("edit")}>
          Edit Member
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("setRole")}>
          Set Role
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("setPassword")}>
          Set Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {session?.userId !== member.id && (
          <DropdownMenuItem onClick={() => handleAction("impersonate")}>
            Impersonate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction("revokeSessions")}>
          Manage Sessions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("revokeAll")}>
          Revoke All Sessions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("ban")}>
          {member.banned ? "Unban" : "Ban"} Member
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => handleAction("remove")}
        >
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove <strong>{member.username}</strong>?
              <br /><br />
              This action cannot be undone and will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Delete their account permanently</li>
                <li>Remove all their data</li>
                <li>Revoke all active sessions</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}