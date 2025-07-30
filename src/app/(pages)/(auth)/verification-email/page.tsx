import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { VerificationEmailForm } from "@/components/form/verification-email";

export default async function VerificationEmailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user.emailVerified) {
    redirect("/");
  }

  return <VerificationEmailForm />;
}
