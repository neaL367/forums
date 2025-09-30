"use client";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Forum } from "@/types/forum";

interface ForumsRowActionsProps {
  row: Row<Forum>;
}

export function ForumsRowActions({ row }: ForumsRowActionsProps) {
  const forum = row.original;

  const handleEdit = () => {
    // TODO: Implement edit forum functionality
    console.log("Edit forum:", forum.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete forum functionality
    console.log("Delete forum:", forum.id);
  };

  const handleViewTopics = () => {
    // TODO: Navigate to topics page for this forum
    console.log("View topics for forum:", forum.id);
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
      <DropdownMenuContent align="end" className="w-[220px]">
        {/* View Actions */}
        <DropdownMenuItem onClick={handleViewTopics}>
          <MessageSquare className="mr-2 h-4 w-4" />
          View Forums
        </DropdownMenuItem>
    
        {/* Management Actions */}
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Forum
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Destructive Actions */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Forum
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
