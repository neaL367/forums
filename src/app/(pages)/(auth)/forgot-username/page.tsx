import { redirect } from "next/navigation";
import { ForgotUsernameForm } from "@/components/form/auth/forgot-username";
import { verifySession } from "@/lib/dal";

export default async function ForgotUsernamePage() {
  const session = await verifySession();

  if (session) {
    redirect("/");
  } else {
    return <ForgotUsernameForm />;
  }
}
