"use client";

import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Members, Roles } from "@/types/members";
import { authClient } from "@/lib/auth-client";

import { actions } from "./data/data";
import { setMemberRoleAction } from "@/actions/administrator/member";

import { BanMemberDialog } from "./dialog/ban-member-dialog";
import { SetPasswordDialog } from "./dialog/set-password-dialog";
import { EditMemberDialog } from "./dialog/edit-member-dialog";
import { SessionManagementDialog } from "./dialog/sessions-manage-dialog";
import { ConfirmationDialogs } from "./dialog/confirmation-alert-dialog";


interface MemberRowActionsProps {
  row: Row<Members>;
}

type DialogType =
  | "ban"
  | "setPassword"
  | "editMember"
  | "manageSessions"
  | null;

type AlertType =
  | "unban"
  | "remove"
  | "impersonate"
  | "revokeAllSessions"
  | null;

export function MemberRowActions({ row }: MemberRowActionsProps) {
  const member = row.original;
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [alertType, setAlertType] = useState<AlertType>(null);
  const [loading, setLoading] = useState(false);

  const computedActions = useMemo(() => {
    return actions
      .map((action) => {
        let displayLabel = action.label;
        if (action.label === "Ban/Unban Member") {
          displayLabel = member.banned ? "Unban Member" : "Ban Member";
        }
        return { ...action, displayLabel } as typeof action & { displayLabel: string };
      })
      .filter((action) => !(action.label === "Impersonate" && member.id === currentUserId));
  }, [member.banned, member.id, currentUserId]);

  const isSelf = member.id === currentUserId;

  const handleAction = useCallback(
    (actionLabel: string) => {
      switch (actionLabel) {
        case "View Profile":
          window.open(`/profile/${member.id}`, "_blank");
          break;
        case "Edit Member":
          setDialogType("editMember");
          break;
        case "Set Password":
          setDialogType("setPassword");
          break;
        case "Impersonate":
          setAlertType("impersonate");
          break;
        case "Manage Sessions":
          setDialogType("manageSessions");
          break;
        case "Revoke All Sessions":
          setAlertType("revokeAllSessions");
          break;
        case "Ban Member":
          setDialogType("ban");
          break;
        case "Unban Member":
          setAlertType("unban");
          break;
        case "Remove Member":
          setAlertType("remove");
          break;
      }
    },
    [member.id]
  );

  const handleRoleChange = useCallback(
    async (newRole: string) => {
      setLoading(true);
      try {
        await setMemberRoleAction(member.id, newRole as Roles);
        toast.success(`Role updated to ${newRole}`);
      } catch {
        toast.error("Failed to update role");
      } finally {
        setLoading(false);
      }
    },
    [member.id]
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {computedActions.map((action, idx) => {
            const displayLabel = action.displayLabel;

            const isDestructive =
              displayLabel.toLowerCase().includes("ban") ||
              displayLabel.toLowerCase().includes("delete") ||
              displayLabel.toLowerCase().includes("remove");

            const needsSeparator =
              action.label === "Set Password" || action.label === "Ban/Unban Member";

            const isSelfDestructive =
              isSelf && ["Remove Member", "Ban Member", "Unban Member", "Revoke All Sessions"].includes(displayLabel);

            return (
              <div key={`${displayLabel}-${idx}`}>
                {needsSeparator && <DropdownMenuSeparator />}
                {action.subMenu ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                      {action.subMenu.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-[180px]">
                      <DropdownMenuRadioGroup
                        value={member.role}
                        onValueChange={handleRoleChange}
                      >
                        {action.subMenu.options.map((opt) => (
                          <DropdownMenuRadioItem
                            key={opt.value}
                            value={opt.value}
                            className="cursor-pointer"
                            disabled={loading}
                          >
                            {opt.label}
                            {loading && (
                              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                            )}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem
                    className={`cursor-pointer ${
                      isDestructive ? "text-destructive focus:text-destructive" : ""
                    }`}
                    disabled={isSelfDestructive}
                    onClick={() => handleAction(displayLabel)}
                    aria-label={displayLabel}
                  >
                    <span className="flex-1">{displayLabel}</span>
                    {"shortcut" in action && (action as { shortcut?: React.ReactNode }).shortcut && (
                      <DropdownMenuShortcut>
                        {(action as { shortcut?: React.ReactNode }).shortcut}
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                )}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Components */}
      {dialogType === "ban" && (
        <BanMemberDialog
          member={member}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogType(null);
          }}
        />
      )}

      {dialogType === "setPassword" && (
        <SetPasswordDialog
          member={member}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogType(null);
          }}
        />
      )}

      {dialogType === "editMember" && (
        <EditMemberDialog
          member={member}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogType(null);
          }}
        />
      )}

      {dialogType === "manageSessions" && (
        <SessionManagementDialog
          member={member}
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogType(null);
          }}
        />
      )}

      {alertType && (
        <ConfirmationDialogs
          member={member}
          alertType={alertType}
          onClose={() => setAlertType(null)}
        />
      )}
    </>
  );
}