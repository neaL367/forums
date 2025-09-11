import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/features/auth/forgot-password";
import { verifySession } from "@/lib/dal";

export default async function ForgotPasswordPage() {
  const session = await verifySession();

  if (session) {
    redirect("/");
  } else {
    return <ForgotPasswordForm />;
  }
}
