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

import { authClient } from "@/lib/auth-client";

import { actions } from "@/features/administrator/members/data/data";
import { setMemberRoleAction } from "@/actions/administrator/members/set-member-role";

import { BanMemberDialog } from "@/features/administrator/members/dialog/ban-member-dialog";
import { SetPasswordDialog } from "@/features/administrator/members/dialog/set-password-dialog";
import { EditMemberDialog } from "@/features/administrator/members/dialog/edit-member-dialog";
import { SessionManagementDialog } from "@/features/administrator/members/dialog/sessions-manage-dialog";
import { ConfirmationDialogs } from "@/features/administrator/members/dialog/confirmation-alert-dialog";
import type { Member, Roles } from "@/types/member";

interface MemberRowActionsProps {
  row: Row<Member>;
}

type DialogType =
  | "none"
  | "ban"
  | "unban"
  | "setPassword"
  | "editMember"
  | "manageSessions"
  | "remove"
  | "impersonate"
  | "revokeAllSessions";

export function MembersRowActions({ row }: MemberRowActionsProps) {
  const member = row.original;
  const { data: session, refetch } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [activeDialog, setActiveDialog] = useState<DialogType>("none");
  const [loading, setLoading] = useState(false);

  const computedActions = useMemo(() => {
    return actions
      .map((action) => {
        let displayLabel = action.label;
        if (action.label === "Ban/Unban Member") {
          displayLabel = member.banned ? "Unban Member" : "Ban Member";
        }
        return { ...action, displayLabel } as typeof action & {
          displayLabel: string;
        };
      })
      .filter(
        (action) =>
          !(action.label === "Impersonate" && member.id === currentUserId),
      );
  }, [member.banned, member.id, currentUserId]);

  const isSelf = member.id === currentUserId;

  const closeDialog = useCallback(() => {
    setActiveDialog("none");
  }, []);

  const handleAction = useCallback(
    (actionLabel: string) => {
      switch (actionLabel) {
        case "View Profile":
          window.open(`/profile/${member.id}`, "_blank");
          return;
        case "Edit Member":
          setActiveDialog("editMember");
          return;
        case "Set Password":
          setActiveDialog("setPassword");
          return;
        case "Impersonate":
          setActiveDialog("impersonate");
          return;
        case "Manage Sessions":
          setActiveDialog("manageSessions");
          return;
        case "Revoke All Sessions":
          setActiveDialog("revokeAllSessions");
          return;
        case "Ban Member":
          setActiveDialog("ban");
          return;
        case "Unban Member":
          setActiveDialog("unban");
          return;
        case "Remove Member":
          setActiveDialog("remove");
          return;
      }
    },
    [member.id],
  );

  const handleRoleChange = useCallback(
    async (newRole: string) => {
      setLoading(true);
      try {
        await setMemberRoleAction(member.id, newRole as Roles);
        toast.success(`Role updated to ${newRole}`);
        refetch();
      } catch {
        toast.error("Failed to update role");
      } finally {
        setLoading(false);
      }
    },
    [member.id, refetch],
  );

  // Confirmation dialog types
  const isConfirmationDialog =
    activeDialog === "unban" ||
    activeDialog === "remove" ||
    activeDialog === "impersonate" ||
    activeDialog === "revokeAllSessions";

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
              action.label === "Set Password" ||
              action.label === "Ban/Unban Member";

            const isSelfDestructive =
              isSelf &&
              [
                "Remove Member",
                "Ban Member",
                "Unban Member",
                "Revoke All Sessions",
              ].includes(displayLabel);

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
                      isDestructive
                        ? "text-destructive focus:text-destructive"
                        : ""
                    }`}
                    disabled={isSelfDestructive}
                    onSelect={() => handleAction(displayLabel)}
                    aria-label={displayLabel}
                  >
                    <span className="flex-1">{displayLabel}</span>
                    {"shortcut" in action &&
                      (action as { shortcut?: React.ReactNode }).shortcut && (
                        <DropdownMenuShortcut>
                          {
                            (action as { shortcut?: React.ReactNode })
                              .shortcut
                          }
                        </DropdownMenuShortcut>
                      )}
                  </DropdownMenuItem>
                )}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render active dialogs */}
      {activeDialog === "ban" && (
        <BanMemberDialog
          member={member}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}

      {activeDialog === "setPassword" && (
        <SetPasswordDialog
          member={member}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}

      {activeDialog === "editMember" && (
        <EditMemberDialog
          member={member}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}

      {activeDialog === "manageSessions" && (
        <SessionManagementDialog
          member={member}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}

      {isConfirmationDialog && (
        <ConfirmationDialogs
          member={member}
          alertType={activeDialog}
          onClose={closeDialog}
        />
      )}
    </>
  );
}