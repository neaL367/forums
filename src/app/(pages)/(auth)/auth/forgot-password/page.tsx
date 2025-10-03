import { redirect } from "next/navigation";
import { ForgotPasswordFormClient } from "@/features/auth/forgot-password-client";
import { getServerSession } from "@/lib/dal";

export default async function ForgotPasswordPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  } else {
    return <ForgotPasswordFormClient />;
  }
}
