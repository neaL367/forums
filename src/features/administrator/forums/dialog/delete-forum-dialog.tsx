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

export function DeleteForumDialog({
  forum,
  open,
  onOpenChange,
}: DeleteForumDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDeleteForum = async () => {
    setLoading(true);
    const toastId = toast.loading("Deleting forum...");

    try {
      const result = await deleteForumAction(forum.id);

      toast.dismiss(toastId);

      if (result.success) {
        toast.success(result.message || "Forum deleted successfully");
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to delete forum");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An unexpected error occurred");
      console.error("Error deleting forum:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete forum</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{forum.title}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteForum();
            }}
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
