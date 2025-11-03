import { redirect } from "next/navigation";
import { SignInFormClient } from "@/features/auth/sign-in/sign-in-client";
import { authServer } from "@/lib/auth-server";

export default async function SignInPage() {
  const session = await authServer();

  if (session) {
    redirect("/");
  } else {
    return <SignInFormClient />;
  }
}
