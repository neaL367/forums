import { redirect } from "next/navigation";
import { ForgotUsernameForm } from "@/features/auth/forgot-username";
import { getServerSession } from "@/lib/dal";

export default async function ForgotUsernamePage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  } else {
    return <ForgotUsernameForm />;
  }
}
