"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Member } from "@/types/member";
import { setPasswordFormAction } from "@/actions/administrator/members/set-password";
import type {
  SetPasswordFormData,
  SetPasswordFormState,
} from "@/formdata/administrator/member/set-password";
import { useDialog } from "@/hooks/use-dialog";

interface SetPasswordDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: SetPasswordFormState = {
  success: false,
  message: "",
};

export function SetPasswordDialog({
  member,
  open,
  onOpenChange,
}: SetPasswordDialogProps) {
  const { state, formAction, pending } = useDialog<SetPasswordFormData>({
    action: setPasswordFormAction,
    initialState,
    loadingMessage: "Updating password...",
    onSuccessCallbackAction: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Password</DialogTitle>
          <DialogDescription>
            Set a new password for {member.username}.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="memberId" value={member.id} />

          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password..."
              defaultValue={
                !state.success ? (state.inputs?.newPassword ?? "") : ""
              }
            />
            {state.errors?.newPassword && (
              <p className="text-sm text-red-600">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password..."
              defaultValue={
                !state.success ? (state.inputs?.confirmPassword ?? "") : ""
              }
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-red-600">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Password must be at least 8 characters long.
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
