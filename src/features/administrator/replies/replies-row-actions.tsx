"use client";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  Settings,
  MessageCircle,
  Pin,
  Move,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Replies } from "@/types/replies";

interface RepliesRowActionsProps {
  row: Row<Replies>;
}

export function RepliesRowActions({ row }: RepliesRowActionsProps) {
  const replies = row.original;

  const handleEdit = () => {
    // TODO: Implement edit replies functionality
    console.log("Edit replies:", replies.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete replies functionality
    console.log("Delete replies:", replies.id);
  };

  const handleViewReplies = () => {
    // TODO: Implement view replies functionality
    console.log("View replies for replies:", replies.id);
  };

  const handlePin = () => {
    // TODO: Implement pin replies functionality
    console.log("Pin replie:", replies.id);
  };

  const handleMove = () => {
    // TODO: Implement move replies functionality
    console.log("Move replie:", replies.id);
  };

  const handleSettings = () => {
    // TODO: Implement replies settings functionality
    console.log("Replies settings:", replies.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          aria-label="Open actions menu"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={handleViewReplies}>
          <MessageCircle className="mr-2 h-4 w-4" />
          View Replies
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handlePin}>
          <Pin className="mr-2 h-4 w-4" />
          Pin Reply
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Reply
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleMove}>
          <Move className="mr-2 h-4 w-4" />
          Move Reply
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Reply Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Topic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
