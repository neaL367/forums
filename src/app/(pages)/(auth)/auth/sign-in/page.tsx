import { redirect } from "next/navigation";
import { SignInFormClient } from "@/features/auth/sign-in-client";
import { getServerSession } from "@/lib/dal";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  } else {
    return <SignInFormClient />;
  }
}
