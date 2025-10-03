import { redirect } from "next/navigation";
import { VerificationEmailFormClient } from "@/features/auth/verification-email-client";
import { getServerSession } from "@/lib/dal";

export default async function VerificationEmailPage() {
  const session = await getServerSession();

  if (session && session.user.emailVerified) {
    redirect("/");
  } else {
    return <VerificationEmailFormClient />;
  }
}
