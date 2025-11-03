import { redirect } from "next/navigation";
import { ForgotUsernameFormClient } from "@/features/auth/forgot-username/forgot-username-client";
import { authServer } from "@/lib/auth-server";

export default async function ForgotUsernamePage() {
  const session = await authServer();

  if (session) {
    redirect("/");
  } else {
    return <ForgotUsernameFormClient />;
  }
}
