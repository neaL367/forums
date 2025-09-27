"use client";

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Categories } from "@/types/categories";

interface CategoriesRowActionsProps {
  row: Row<Categories>;
}

export function CategoriesRowActions({ row }: CategoriesRowActionsProps) {
  const category = row.original;

  const handleEdit = () => {
    // TODO: Implement edit category functionality
    console.log("Edit category:", category.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete category functionality
    console.log("Delete category:", category.id);
  };

  const handleViewForums = () => {
    // TODO: Implement view forums functionality
    console.log("View forums for category:", category.id);
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
        <DropdownMenuItem onClick={handleViewForums}>
          <Eye className="mr-2 h-4 w-4" />
          View Categories
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
