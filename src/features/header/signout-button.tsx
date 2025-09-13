"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(`Sign out failed: ${ctx.error.message}`);
        },
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <div onClick={handleSignOut} className="flex w-full gap-2 ">
      <LogOut className="h-4 w-4" />
      <span className="">Sign Out</span>
    </div>
  );
}
