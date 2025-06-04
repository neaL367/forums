"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const {
    refetch,
  } = authClient.useSession();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          refetch();
        },
      },
    });
  };

  return (
    <div
      onClick={handleSignOut}
      className="flex items-center w-full gap-2 hover:bg-zinc-800"
    >
      <LogOut className="h-4 w-4" />
      <span className="">Sign Out</span>
    </div>
  );
}
