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
import { Textarea } from "@/components/ui/textarea";
import { Members } from "@/types/members";
import { banMemberAction } from "@/actions/administrator/ban";

interface BanMemberDialogProps {
  member: Members;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanMemberDialog({ member, open, onOpenChange }: BanMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banExpiresIn, setBanExpiresIn] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!banReason && !banExpiresIn) {
      setError("Please provide a reason or an expiration time.");
      return false;
    }
    if (banExpiresIn && isNaN(parseInt(banExpiresIn))) {
      setError("Expiration time must be a valid number.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleBanMember = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const expiresIn = banExpiresIn ? parseInt(banExpiresIn) * 86400 : undefined; // convert days to seconds
      await banMemberAction(member.id, banReason, expiresIn);
      toast.success("Member banned successfully");
      onOpenChange(false);
      setBanReason("");
      setBanExpiresIn("");
    } catch {
      toast.error("Failed to ban member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban Member</DialogTitle>
          <DialogDescription>
            Ban {member.username}. This action can be reversed later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="banReason">Reason (optional)</Label>
            <Textarea
              id="banReason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter ban reason..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="banExpires">Expires in (days, optional)</Label>
            <Input
              id="banExpires"
              type="number"
              value={banExpiresIn}
              onChange={(e) => setBanExpiresIn(e.target.value)}
              placeholder="Leave empty for permanent ban"
              aria-describedby="banExpiresHint"
            />
            <small id="banExpiresHint" className="text-sm text-muted-foreground">
              If left empty, the ban will be permanent.
            </small>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBanMember}
            disabled={loading}
            aria-label="Ban Member"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ban Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
