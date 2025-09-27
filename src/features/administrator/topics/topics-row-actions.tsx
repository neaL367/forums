"use client";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  MessageCircle,
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

import type { Topics } from "@/types/topics";

interface TopicsRowActionsProps {
  row: Row<Topics>;
}

export function TopicsRowActions({ row }: TopicsRowActionsProps) {
  const topic = row.original;

  const handleEdit = () => {
    // TODO: Implement edit topic functionality
    console.log("Edit topic:", topic.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete topic functionality
    console.log("Delete topic:", topic.id);
  };

  const handleViewTopics = () => {
    // TODO: Implement view replies functionality
    console.log("View replies for topic:", topic.id);
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
        <DropdownMenuItem onClick={handleViewTopics}>
          <MessageCircle className="mr-2 h-4 w-4" />
          View Topics
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Topic
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
