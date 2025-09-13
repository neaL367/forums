import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/features/auth/forgot-password";
import { getServerSession } from "@/lib/dal";

export default async function ForgotPasswordPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  } else {
    return <ForgotPasswordForm />;
  }
}
