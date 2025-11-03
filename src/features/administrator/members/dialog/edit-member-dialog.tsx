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
import { editMemberFormAction } from "@/actions/administrator/members/edit-member";
import type {
  EditMemberFormData,
  EditMemberFormState,
} from "@/formdata/administrator/member/edit-member";
import { useDialog } from "@/hooks/use-dialog";

interface EditMemberDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: EditMemberFormState = {
  success: false,
  message: "",
};

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: EditMemberDialogProps) {
  const { state, formAction, pending } = useDialog<EditMemberFormData>({
    action: editMemberFormAction,
    initialState,
    loadingMessage: "Updating member...",
    onSuccessCallbackAction: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update {member.username}&apos;s information.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="memberId" value={member.id} />
          
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter username..."
              defaultValue={
                !state.success
                  ? (state.inputs?.username ?? member.username)
                  : member.username
              }
            />
            {state.errors?.username && (
              <p className="text-sm text-red-600">{state.errors.username[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="displayUsername">Display Username</Label>
            <Input
              id="displayUsername"
              name="displayUsername"
              placeholder="Enter display username..."
              defaultValue={
                !state.success
                  ? (state.inputs?.displayUsername ?? member.displayUsername)
                  : member.displayUsername
              }
            />
            {state.errors?.displayUsername && (
              <p className="text-sm text-red-600">
                {state.errors.displayUsername[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="Enter image URL..."
              defaultValue={
                !state.success
                  ? (state.inputs?.image ?? member.image ?? "")
                  : (member.image ?? "")
              }
            />
            {state.errors?.image && (
              <p className="text-sm text-red-600">{state.errors.image[0]}</p>
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
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
