"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

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

import { useDialog } from "@/hooks/use-dialog";
import { impersonateMemberFormAction } from "@/actions/administrator/members/impersonate-member";
import { unbanMemberFormAction } from "@/actions/administrator/members/unban-member";
import { removeMemberFormAction } from "@/actions/administrator/members/remove-member";
import { revokeAllSessionsFormAction } from "@/actions/administrator/members/revoke-all-sessions";
import type { Member } from "@/types/member";
import type { UnbanMemberFormState } from "@/formdata/administrator/member/unban-member";
import type { RemoveMemberFormState } from "@/formdata/administrator/member/remove-member";
import type { ImpersonateMemberFormState } from "@/formdata/administrator/member/impersonate-member";
import type { RevokeAllSessionsFormState } from "@/formdata/administrator/member/revoke-all-sessions";

interface ConfirmationDialogsProps {
  member: Member;
  alertType: "unban" | "remove" | "impersonate" | "revokeAllSessions" | null;
  onClose: () => void;
}

const initialState = {
  success: false,
  message: "",
};

export function ConfirmationDialogs({
  member,
  alertType,
  onClose,
}: ConfirmationDialogsProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const unbanDialog = useDialog<{ memberId: string }>({
    action: unbanMemberFormAction,
    initialState: initialState as UnbanMemberFormState,
    loadingMessage: "Unbanning member...",
    onSuccessCallbackAction: () => onClose(),
  });

  const removeDialog = useDialog<{ memberId: string }>({
    action: removeMemberFormAction,
    initialState: initialState as RemoveMemberFormState,
    loadingMessage: "Removing member...",
    onSuccessCallbackAction: () => onClose(),
  });

  const impersonateDialog = useDialog<{ memberId: string }>({
    action: impersonateMemberFormAction,
    initialState: initialState as ImpersonateMemberFormState,
    loadingMessage: "Starting impersonation...",
    onSuccessCallbackAction: () => {
      onClose();
      router.push("/");
      router.refresh();
    },
  });

  const revokeDialog = useDialog<{ memberId: string }>({
    action: revokeAllSessionsFormAction,
    initialState: initialState as RevokeAllSessionsFormState,
    loadingMessage: "Revoking all sessions...",
    onSuccessCallbackAction: () => onClose(),
  });


  const getDialogConfig = () => {
    switch (alertType) {
      case "unban":
        return {
          title: "Unban Member",
          description: `Are you sure you want to unban ${member.username}? They will regain access immediately.`,
          action: "Unban",
          dialog: unbanDialog,
          destructive: false,
        };
      case "remove":
        return {
          title: "Remove Member",
          description: `Are you sure you want to permanently remove ${member.username}? This action cannot be undone.`,
          action: "Remove",
          dialog: removeDialog,
          destructive: true,
        };
      case "impersonate":
        return {
          title: "Impersonate Member",
          description: `You are about to impersonate ${member.username}. You will be logged in as this user.`,
          action: "Impersonate",
          dialog: impersonateDialog,
          destructive: false,
        };
      case "revokeAllSessions":
        return {
          title: "Revoke All Sessions",
          description: `Are you sure you want to revoke all sessions for ${member.username}? They will be logged out from all devices.`,
          action: "Revoke All",
          dialog: revokeDialog,
          destructive: false,
        };
      default:
        return null;
    }
  };

  const config = getDialogConfig();
  if (!config) return null;

  const { formAction, pending, open, onOpenChange } = config.dialog;

  return (
    <AlertDialog
      open={open && !!alertType}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="memberId" value={member.id} />
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }}
            disabled={pending}
            className={
              config.destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {config.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
