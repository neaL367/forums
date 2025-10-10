"use client";

import { useState, useCallback, JSX } from "react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal, Edit, Trash2, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Forum } from "@/types/forum";
import { Dialog } from "@/components/ui/dialog";

import { EditForumDialog } from "@/features/administrator/forums/dialogs/edit-forum-dialog";
import { DeleteForumDialog } from "./dialogs/delete-forum-dialog";

// import { DeleteForumDialog } from "@/features/administrator/forums/dialogs/delete-forum-dialog";

interface ForumsRowActionsProps {
  row: Row<Forum>;
  availableParentForums: Forum[];
}

export function ForumsRowActions({
  row,
  availableParentForums,
}: ForumsRowActionsProps) {
  const forum = row.original;
  const [dialogMenu, setDialogMenu] = useState<string>("none");

  const handleAction = useCallback(
    (actionLabel: string) => {
      switch (actionLabel) {
        case "View Topics":
          window.open(`/forums/${forum.id}`, "_blank");
          break;
        case "Edit Forum":
          setDialogMenu("editForum");
          break;
        case "Delete Forum":
          setDialogMenu("deleteForum");
          break;
        default:
          toast.info(`Action: ${actionLabel}`);
      }
    },
    [forum.id]
  );

  const handleDialogMenu = useCallback((): JSX.Element | null => {
    switch (dialogMenu) {
      case "editForum":
        return (
          <EditForumDialog
            forum={forum}
            availableParentForums={availableParentForums}
            open={true}
            onOpenChange={(open) => {
              if (!open) setDialogMenu("none");
            }}
          ></EditForumDialog>
        );
      case "deleteForum":
        return (
          <DeleteForumDialog
            forum={forum}
            open={true}
            onOpenChange={(open) => {
              if (!open) setDialogMenu("none");
            }}
          />
        );
      default:
        return null;
    }
  }, [dialogMenu, forum, availableParentForums]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open forum actions"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuItem onClick={() => handleAction("View Topics")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            View Topics
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleAction("Edit Forum")}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Forum
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("Delete Forum")}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Forum
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {handleDialogMenu()}
    </Dialog>
  );
}
