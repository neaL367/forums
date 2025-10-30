import { redirect } from "next/navigation";
import { ForgotPasswordFormClient } from "@/features/auth/forgot-password-client";
import { authServer } from "@/lib/auth-server";

export default async function ForgotPasswordPage() {
  const session = await authServer();
  if (session) {
    redirect("/");
  } else {
    return <ForgotPasswordFormClient />;
  }
}
