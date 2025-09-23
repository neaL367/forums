"use client";

import { MoreHorizontal, Edit, Trash2, Eye, Settings, Plus, MessageSquare, Users } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Forums } from "@/types/forums";

interface ForumsRowActionsProps {
  row: Row<Forums>;
}

export function ForumsRowActions({ row }: ForumsRowActionsProps) {
  const forum = row.original;
  const isSubForum = row.depth > 0;

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

  const handleAddSubForum = () => {
    // TODO: Implement add sub-forum functionality
    console.log("Add sub-forum to:", forum.id);
  };

  const handleAddTopic = () => {
    // TODO: Implement add topic functionality
    console.log("Add topic to forum:", forum.id);
  };

  const handleSettings = () => {
    // TODO: Implement forum settings functionality
    console.log("Forum settings:", forum.id);
  };

  const handleManagePermissions = () => {
    // TODO: Implement permissions management
    console.log("Manage permissions for forum:", forum.id);
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
          View Topics ({forum.topics?.length || 0})
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Add Actions */}
        <DropdownMenuItem onClick={handleAddTopic}>
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </DropdownMenuItem>

        {!isSubForum && (
          <DropdownMenuItem onClick={handleAddSubForum}>
            <Users className="mr-2 h-4 w-4" />
            Add Sub-Forum
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Management Actions */}
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Forum
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Forum Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleManagePermissions}>
          <Eye className="mr-2 h-4 w-4" />
          Manage Permissions
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