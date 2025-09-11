"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [searchType, setSearchType] = useState(searchParams.get("type") || "all");

  const handleSearch = useDebouncedCallback((term: string, type: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    if (type && type !== "all") {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    replace(`/search?${params.toString()}`);
  }, 300)

  return (
    <div className="relative hidden lg:flex items-center gap-2 flex-1 max-w-2xl">
      <Input
        type="search"
        placeholder="Search forums, members or topics..."
        className="w-full bg-zinc-800  text-white placeholder:text-zinc-400 pr-10"
        onChange={(e) => {
          handleSearch(e.target.value, searchType);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-white"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      <Select
        onValueChange={(value) => {
          setSearchType(value);
          handleSearch(searchParams.get("query") || "", value);
        }}
        defaultValue={searchType}
      >
        <SelectTrigger className="w-[120px] text-white hover:cursor-pointer">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className=" text-white">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="members">Members</SelectItem>
          <SelectItem value="forums">Forums</SelectItem>
          <SelectItem value="topics">Topics</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
