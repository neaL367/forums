"use client";

import { Button } from "@/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { ForgotPasswordForm } from "@/components/form/forgot-password";

export default function ForgotPasswordPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="p-4">Loading...</div>;
  }

  if (session) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-4">
          You are logged in, please sign out to recover your password.
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
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
