import { redirect } from "next/navigation";
import { SignUpFormClient } from "@/features/auth/sign-up-client";
import { authServer } from "@/lib/auth-server";

export default async function SignUpPage() {
  const session = await authServer();
  if (session) {
    redirect("/");
  } else {
    return <SignUpFormClient />;
  }
}
