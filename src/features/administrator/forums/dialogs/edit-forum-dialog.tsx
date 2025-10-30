"use client";

import { toast } from "sonner";
import { useEffect, useActionState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import type { Forum } from "@/types/forum";
import type { AddForumFormState } from "@/formdata/administrator/forum/add-forum";
import { updateForumAction } from "@/actions/administrator/forums/update-forum";

const initialState: AddForumFormState = {
  success: false,
  message: "",
};

interface EditForumDialogProps {
  forum: Forum;
  availableParentForums: Forum[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditForumDialog({
  forum,
  availableParentForums,
  open,
  onOpenChange
}: EditForumDialogProps) {

  const [state, formAction, isPending] = useActionState(
    updateForumAction,
    initialState
  );

  const flattenForums = (forums: Forum[]): Forum[] => {
    const result: Forum[] = [];
    const flatten = (forumList?: Forum[]) => {
      if (!Array.isArray(forumList)) return; 
      forumList.forEach((forum) => {
        result.push(forum);
        if (Array.isArray(forum.subForums) && forum.subForums.length > 0) {
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
      toast.success(state.message ?? "Forum updated successfully");
      onOpenChange(false);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Forum</DialogTitle>
          <DialogDescription>
            Modify the details of this forum below.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="forumId" value={forum.id} />

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={
                !state.success
                  ? (state.inputs?.title ?? forum.title)
                  : forum.title
              }
              placeholder="Enter forum title..."
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
                !state.success
                  ? (state.inputs?.description ?? forum.description)
                  : forum.description
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
                  ? (state.inputs?.parentForumId ??
                    forum.parentForumId ??
                    "none")
                  : (forum.parentForumId ?? "none")
              }
            >
              <SelectTrigger id="parentForumId">
                <SelectValue placeholder="Select parent forum (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-level forum)</SelectItem>
                {flatForums
                  .filter(
                    (f) =>
                      f.id !== forum.id && // exclude self
                      f.depth < 2 // prevent exceeding 3 levels
                  )
                  .map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 h-4"
                        >
                          L{f.depth}
                        </Badge>
                        {f.title}
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
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}