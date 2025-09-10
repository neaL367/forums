"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import { Members } from "@/types/members";
import { impersonateMemberAction } from "@/actions/administrator/impersonate";
import { unbanMemberAction } from "@/actions/administrator/ban";
import { removeMemberAction } from "@/actions/administrator/member";
import { revokeAllSessionsMemberAction } from "@/actions/administrator/revoke";

interface ConfirmationDialogsProps {
  member: Members;
  alertType: "unban" | "remove" | "impersonate" | "revokeAllSessions" | null;
  onClose: () => void;
}

export function ConfirmationDialogs({ 
  member, 
  alertType, 
  onClose 
}: ConfirmationDialogsProps) {
  const [loading, setLoading] = useState(false);


  const handleUnbanMember = async () => {
    setLoading(true);
    try {
      await unbanMemberAction(member.id);
      toast.success("Member unbanned successfully");
      onClose();
    } catch  {
      toast.error("Failed to unban member");
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async () => {
    setLoading(true);
    try {
      await impersonateMemberAction(member.id);
      toast.success("Impersonation started");
      onClose();
      // Redirect or refresh as needed
      window.location.href = "/";
    } catch  {
      toast.error("Failed to impersonate member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    setLoading(true);
    try {
      await removeMemberAction(member.id);
      toast.success("Member removed successfully");
      onClose();
    } catch  {
      toast.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setLoading(true);
    try {
      await revokeAllSessionsMemberAction(member.id);
      toast.success("All sessions revoked successfully");
      onClose();
    } catch  {
      toast.error("Failed to revoke sessions");
    } finally {
      setLoading(false);
    }
  };

  const getDialogConfig = () => {
    switch (alertType) {
      case "unban":
        return {
          title: "Unban Member",
          description: `Are you sure you want to unban ${member.username}? They will regain access immediately.`,
          action: "Unban",
          handler: handleUnbanMember,
          destructive: false,
        };
      case "remove":
        return {
          title: "Remove Member",
          description: `Are you sure you want to permanently remove ${member.username}? This action cannot be undone.`,
          action: "Remove",
          handler: handleRemoveMember,
          destructive: true,
        };
      case "impersonate":
        return {
          title: "Impersonate Member",
          description: `You are about to impersonate ${member.username}. You will be logged in as this user.`,
          action: "Impersonate",
          handler: handleImpersonate,
          destructive: false,
        };
      case "revokeAllSessions":
        return {
          title: "Revoke All Sessions",
          description: `Are you sure you want to revoke all sessions for ${member.username}? They will be logged out from all devices.`,
          action: "Revoke All",
          handler: handleRevokeAllSessions,
          destructive: false,
        };
      default:
        return null;
    }
  };

  const config = getDialogConfig();
  if (!config) return null;

  return (
    <AlertDialog open={!!alertType} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={config.handler}
            disabled={loading}
            className={config.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {config.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}