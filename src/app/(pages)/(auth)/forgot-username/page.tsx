import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ForgotUsernameForm } from "@/components/form/auth/forgot-username";

export default async function ForgotUsernamePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <ForgotUsernameForm />;
}
