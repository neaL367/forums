import { redirect } from "next/navigation";
import { VerificationEmailFormClient } from "@/features/auth/verification-email-client";
import { authServer } from "@/lib/auth-server";

export default async function VerificationEmailPage() {
  const session = await authServer();

  if (session && session.user.emailVerified) {
    redirect("/");
  } else {
    return <VerificationEmailFormClient />;
  }
}
