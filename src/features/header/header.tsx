import Link from "next/link";
import { Suspense } from "react";

import { MemberMenu } from "@/features/header/member-menu";
import { Search } from "@/features/header/search";

export async function Header() {
  return (
    <header className="z-10 sticky top-0 w-full border-b bg-background">
      <div className="flex items-center justify-between gap-4 px-8 h-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              Forum
            </span>
            <span className="text-xs text-zinc-400">2025</span>
          </div>
        </Link>
        <Suspense fallback={null}>
          <Search />
        </Suspense>

        <MemberMenu />
      </div>
    </header>
  );
}
