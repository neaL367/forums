import { redirect } from "next/navigation";
import { SignUpFormClient } from "@/features/auth/sign-up-client";
import { getServerSession } from "@/lib/dal";

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  } else {
    return <SignUpFormClient />;
  }
}
