import Link from "next/link"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/header/user-menu"

export function Header() {
  return (
    <header className="z-10 sticky top-0 w-full border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-8 h-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">Forum</span>
            <span className="text-xs text-zinc-400">2025</span>
          </div>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search forums, members, or topics..."
            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <UserMenu />
      </div>
    </header>
  )
}
