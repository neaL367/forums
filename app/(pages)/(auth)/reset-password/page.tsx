"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/form/reset-password";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  useEffect(() => {
    if (token) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [token]);

  if (isPending) {
    return <div className="p-4">Loading...</div>;
  }

  if (session) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-4">
          You are already logged in.
        </p>
        <Button
          onClick={() => signOut()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  if (!token) {
    return <div className="p-4">Redirecting...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      <ResetPasswordForm token={token} />
    </div>
  );
}
