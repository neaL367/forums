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
import { Textarea } from "@/components/ui/textarea";

import { Member } from "@/types/member";
import { banMemberFormAction } from "@/actions/administrator/members/ban-member";
import type {
  BanMemberFormData,
  BanMemberFormState,
} from "@/formdata/administrator/member/ban-member";
import { useDialog } from "@/hooks/use-dialog";

interface BanMemberDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: BanMemberFormState = {
  success: false,
  message: "",
};

export function BanMemberDialog({
  member,
  open,
  onOpenChange,
}: BanMemberDialogProps) {
  const { state, formAction, pending } = useDialog<BanMemberFormData>({
    action: banMemberFormAction,
    initialState,
    loadingMessage: "Banning member...",
    onSuccessCallbackAction: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban Member</DialogTitle>
          <DialogDescription>
            Ban {member.username}. This action can be reversed later.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="memberId" value={member.id} />

          <div className="grid gap-2">
            <Label htmlFor="banReason">Reason</Label>
            <Textarea
              id="banReason"
              name="banReason"
              placeholder="Enter ban reason..."
              defaultValue={
                !state.success ? (state.inputs?.banReason ?? "") : ""
              }
            />
            {state.errors?.banReason && (
              <p className="text-sm text-red-600">
                {state.errors.banReason[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="banExpiresIn">Expires in (days, optional)</Label>
            <Input
              id="banExpiresIn"
              name="banExpiresIn"
              type="number"
              placeholder="Leave empty for permanent ban"
              defaultValue={
                !state.success ? (state.inputs?.banExpiresIn ?? "") : ""
              }
              aria-describedby="banExpiresHint"
            />
            <small
              id="banExpiresHint"
              className="text-sm text-muted-foreground"
            >
              If left empty, the ban will be permanent.
            </small>
            {state.errors?.banExpiresIn && (
              <p className="text-sm text-red-600">
                {state.errors.banExpiresIn[0]}
              </p>
            )}
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
            <Button
              type="submit"
              variant="destructive"
              disabled={pending}
              aria-label="Ban Member"
            >
              {pending ? "Banning..." : "Ban Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
