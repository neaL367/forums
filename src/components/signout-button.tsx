"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(`Sign out failed: ${ctx.error.message}`);
        },
        onSuccess: () => {
          router.push("/");
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
