"use client";

import type React from "react";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useActionState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { addForumAction } from "@/actions/administrator/forums/add-forum";
import type { AddForumFormState } from "@/formdata/administrator/forums/add-forum";
import type { Forum } from "@/types/forum";

const initialState: AddForumFormState = {
  success: false,
  message: "",
};

interface AddForumDialogProps {
  children: React.ReactNode;
  availableParentForums: Forum[];
}

export function AddForumDialog({
  children,
  availableParentForums,
}: AddForumDialogProps) {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    addForumAction,
    initialState
  );

  // Flatten forums to get all forums with their depths
  const flattenForums = (forums: Forum[]): Forum[] => {
    const result: Forum[] = [];
    const flatten = (forumList: Forum[]) => {
      forumList.forEach((forum) => {
        result.push(forum);
        if (forum.subForums && forum.subForums.length > 0) {
          flatten(forum.subForums);
        }
      });
    };
    flatten(forums);
    return result;
  };

  const flatForums = flattenForums(availableParentForums);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? "Forum added successfully");
      setOpen(false);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Forum</DialogTitle>
          <DialogDescription>
            Create a new forum by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter forum title..."
              defaultValue={!state.success ? (state.inputs?.title ?? "") : ""}
            />
            {state.errors?.title && (
              <p className="text-sm text-red-600">{state.errors.title[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter forum description..."
              defaultValue={
                !state.success ? (state.inputs?.description ?? "") : ""
              }
            />
            {state.errors?.description && (
              <p className="text-sm text-red-600">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          {/* Parent Forum */}
          <div className="grid gap-2">
            <Label htmlFor="parentForumId">Parent Forum</Label>
            <Select
              name="parentForumId"
              defaultValue={
                !state.success
                  ? (state.inputs?.parentForumId ?? "none")
                  : "none"
              }
            >
              <SelectTrigger id="parentForumId">
                <SelectValue placeholder="Select parent forum (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-level forum)</SelectItem>
                {flatForums
                  .filter((forum) => forum.depth < 2)
                  .map((forum) => (
                    <SelectItem key={forum.id} value={forum.id}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 h-4"
                        >
                          L{forum.depth}
                        </Badge>
                        {forum.title}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {state.errors?.parentForumId && (
              <p className="text-sm text-red-600">
                {state.errors.parentForumId[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Only forums with depth less than 3 levels are available as parents
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Forum"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}