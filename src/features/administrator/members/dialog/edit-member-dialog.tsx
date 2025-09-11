"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import { Members } from "@/types/members";
import { updateMemberAction } from "@/actions/administrator/member";
import { authClient } from "@/lib/auth-client";

interface EditMemberDialogProps {
  member: Members;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
  const { refetch } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: member.username || "",
    displayUsername: member.displayUsername || "",
    image: member.image || "",
  });


  const handleEditMember = async () => {


    setLoading(true);
    try {
      await updateMemberAction({
        username: editForm.username,
        displayUsername: editForm.displayUsername,
        image: editForm.image,
      });
      toast.success("Member updated successfully");
      refetch();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update {member.username}&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={editForm.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="Enter username..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="displayUsername">Display Username</Label>
            <Input
              id="displayUsername"
              value={editForm.displayUsername}
              onChange={(e) => updateField("displayUsername", e.target.value)}
              placeholder="Enter display username..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              type="url"
              value={editForm.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="Enter image URL..."
            />
          </div>
         
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditMember} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}