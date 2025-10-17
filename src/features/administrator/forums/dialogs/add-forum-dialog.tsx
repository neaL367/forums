"use client";

import type React from "react";

import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { useActionState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [open, onOpenChange] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("none");

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

  const flatForums = useMemo(
    () => flattenForums(availableParentForums),
    [availableParentForums]
  );

  const eligibleForums = useMemo(
    () => flatForums.filter((forum) => forum.depth < 2),
    [flatForums]
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? "Forum added successfully");
      onOpenChange(false);
      setSelectedParentId("none");
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  useEffect(() => {
    if (!state.success && state.inputs?.parentForumId) {
      setSelectedParentId(state.inputs.parentForumId);
    }
  }, [state.inputs?.parentForumId, state.success]);

  const selectedForum = eligibleForums.find(
    (forum) => forum.id === selectedParentId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {/* Parent Forum - Searchable Combobox */}
          <div className="grid gap-2">
            <Label htmlFor="parentForumId">Parent Forum</Label>
            <input
              type="hidden"
              name="parentForumId"
              value={selectedParentId}
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
                  {selectedParentId === "none" ? (
                    "None (Top-level forum)"
                  ) : selectedForum ? (
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
                    "Select parent forum..."
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
                      <CommandItem
                        value="none-top-level"
                        onSelect={() => {
                          setSelectedParentId("none");
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedParentId === "none"
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        None (Top-level forum)
                      </CommandItem>
                      {eligibleForums.map((forum) => (
                        <CommandItem
                          key={forum.id}
                          value={`${forum.title}-${forum.id}`}
                          onSelect={() => {
                            setSelectedParentId(forum.id);
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedParentId === forum.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
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
              {isPending ? "Adding..." : "Add Forum"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}