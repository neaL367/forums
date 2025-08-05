import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/form/auth/forgot-password";
import { verifySession } from "@/lib/dal";

export default async function ForgotPasswordPage() {
  const session = await verifySession();
  
  if (session) {
    redirect("/");
  }

  return <ForgotPasswordForm />;
}
