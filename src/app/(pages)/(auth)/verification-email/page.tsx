import { redirect } from "next/navigation";
import { VerificationEmailForm } from "@/features/auth/verification-email";
import { getServerSession } from "@/lib/dal";

export default async function VerificationEmailPage() {
  const session = await getServerSession();

  if (session && session.user.emailVerified) {
    redirect("/");
  } else {
    return <VerificationEmailForm />;
  }
}
