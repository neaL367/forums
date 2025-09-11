import { redirect } from "next/navigation";
import { SignUpForm } from "@/features/auth/sign-up";
import { verifySession } from "@/lib/dal";

export default async function SignUpPage() {
  const session = await verifySession();
  if (session) {
    redirect("/");
  } else {
    return <SignUpForm />;
  }
}
