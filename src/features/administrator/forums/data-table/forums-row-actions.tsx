"use client";

import { useState, useCallback } from "react";
import { MoreHorizontal, Edit, Trash2, MessageSquare } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditForumDialog } from "@/features/administrator/forums/dialog/edit-forum-dialog";
import { DeleteForumDialog } from "@/features/administrator/forums/dialog/delete-forum-dialog";

import type { Forum } from "@/types/forum";

interface ForumsRowActionsProps {
  row: Row<Forum>;
  availableParentForums: Forum[];
}

type DialogType = "none" | "editForum" | "deleteForum";

export function ForumsRowActions({
  row,
  availableParentForums,
}: ForumsRowActionsProps) {
  const forum = row.original;
  const [activeDialog, setActiveDialog] = useState<DialogType>("none");

  const closeDialog = useCallback(() => {
    setActiveDialog("none");
  }, []);

  const handleAction = useCallback(
    (actionLabel: string) => {
      switch (actionLabel) {
        case "View Topics":
          window.open(`/forums/${forum.id}`, "_blank");
          return;
        case "Edit Forum":
          setActiveDialog("editForum");
          return;
        case "Delete Forum":
          setActiveDialog("deleteForum");
          return;
      }
    },
    [forum.id],
  );

  return (
    <>
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

      {/* Render active dialogs */}
      {activeDialog === "editForum" && (
        <EditForumDialog
          forum={forum}
          availableParentForums={availableParentForums}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}

      {activeDialog === "deleteForum" && (
        <DeleteForumDialog
          forum={forum}
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
        />
      )}
    </>
  );
}
