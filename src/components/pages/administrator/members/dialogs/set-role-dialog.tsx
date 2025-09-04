"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Members } from "@/types/member";
import { setMemberRoleAction } from "@/actions/administrator/member";
import { toast } from "sonner";

interface SetRoleDialogProps {
  member: Members;
  onClose: () => void;
  onSuccess: (member: Members) => void;
}

export function SetRoleDialog({ 
  member, 
  onClose, 
  onSuccess 
}: SetRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(member.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await setMemberRoleAction(member.id, selectedRole);
      if (result.success) {
        toast.success(result.message);
        onSuccess({ ...member, role: selectedRole });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Role for {member.username}</DialogTitle>
          <DialogDescription>
            Change the role for this member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={selectedRole} 
              onValueChange={(value: string) => setSelectedRole(value as Members["role"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBERS">Members</SelectItem>
                <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="GUEST">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}