"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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

import type { Forum } from "@/types/forum";
import { deleteForumAction } from "@/actions/administrator/forums/delete-forum";

interface DeleteForumDialogProps {
  forum: Forum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteForumDialog({ forum, open, onOpenChange }: DeleteForumDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDeleteForum = async () => {
    setLoading(true);
    try {
      await deleteForumAction(forum.id);
      toast.success("Forum deleted successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete forum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onOpenChange(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete forum</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{forum.title}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteForum}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
