"use client";

import type React from "react";

import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { useActionState } from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { addTopicAction } from "@/actions/administrator/topics/add-topic";
import type { AddTopicFormState } from "@/formdata/administrator/topic/add-topic";
import type { Forum } from "@/types/forum";

const initialState: AddTopicFormState = {
  success: false,
  message: "",
};

interface AddTopicDialogProps {
  children: React.ReactNode;
  forums: Array<Pick<Forum, 'id' | 'title' | 'depth'>>;
}

export function AddTopicDialog({
  children,
  forums,
}: AddTopicDialogProps) {
  const [open, onOpenChange] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedForumId, setSelectedForumId] = useState<string>("");

  const [state, formAction, isPending] = useActionState(
    addTopicAction,
    initialState
  );

  // Flatten forums hierarchy for selection
  const sortedForums = useMemo(() => {
     return [...forums].sort((a, b) => {
       // Sort by depth first, then by title
       if (a.depth !== b.depth) return a.depth - b.depth;
       return a.title.localeCompare(b.title);
     });
   }, [forums]);
 
   // Find selected forum
   const selectedForum = useMemo(() => {
     return sortedForums.find((f) => f.id === selectedForumId);
   }, [selectedForumId, sortedForums]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? "Topic added successfully");
      onOpenChange(false);
      setSelectedForumId("");
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  useEffect(() => {
    if (!state.success && state.inputs?.forumId) {
      setSelectedForumId(state.inputs.forumId);
    }
  }, [state.inputs?.forumId, state.success]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Topic</DialogTitle>
          <DialogDescription>
            Create a new topic by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter topic title..."
              defaultValue={!state.success ? (state.inputs?.title ?? "") : ""}
            />
            {state.errors?.title && (
              <p className="text-sm text-red-600">{state.errors.title[0]}</p>
            )}
          </div>

          {/* Forum - Searchable Combobox */}
          <div className="grid gap-2">
            <Label htmlFor="forumId">Forum</Label>
            <input
              type="hidden"
              name="forumId"
              value={selectedForumId}
            />
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between"
                  type="button"
                  disabled={isPending}
                >
                  {selectedForum ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs px-1 py-0 h-4"
                      >
                        L{selectedForum.depth}
                      </Badge>
                      {selectedForum.title}
                    </div>
                  ) : (
                    "Select forum..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search forums..." />
                  <CommandList>
                    <CommandEmpty>No forum found.</CommandEmpty>
                    <CommandGroup>
                      {sortedForums.map((forum) => (
                        <CommandItem
                          key={forum.id}
                          value={`${forum.title}-${forum.id}`}
                          onSelect={() => {
                            setSelectedForumId(forum.id);
                            setComboboxOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 h-4"
                            >
                              L{forum.depth}
                            </Badge>
                            <span className="truncate">{forum.title}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {state.errors?.forumId && (
              <p className="text-sm text-red-600">
                {state.errors.forumId[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select the forum where this topic will be created
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
              {isPending ? "Adding..." : "Add Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}