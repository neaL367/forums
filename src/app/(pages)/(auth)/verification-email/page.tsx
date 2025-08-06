import { redirect } from "next/navigation";
import { VerificationEmailForm } from "@/components/form/auth/verification-email";
import { verifySession } from "@/lib/dal";

export default async function VerificationEmailPage() {
  const session = await verifySession();

  if (session && session.user.emailVerified) {
    redirect("/");
  } else {
    return <VerificationEmailForm />;
  }
}
