import { redirect } from "next/navigation";
import { ForgotUsernameFormClient } from "@/features/auth/forgot-username-client";
import { getServerSession } from "@/lib/dal";

export default async function ForgotUsernamePage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  } else {
    return <ForgotUsernameFormClient />;
  }
}
