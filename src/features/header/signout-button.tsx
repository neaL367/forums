"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading("Signing out...");

    try {
      await authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.dismiss(loadingToast);
            toast.error(`Sign out failed: ${ctx.error.message}`);
            setIsLoading(false);
          },
          onSuccess: () => {
            toast.dismiss(loadingToast);
            router.push("/");
            router.refresh();
            setIsLoading(false);
            toast.success("Signed out successfully!");
          },
        },
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred during sign out");
      setIsLoading(false);
    }
  };

  return (
    <div 
      onClick={handleSignOut} 
      className={`flex w-full gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className="">
        {isLoading ? "Signing out..." : "Sign Out"}
      </span>
    </div>
  );
}