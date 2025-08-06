import { redirect } from "next/navigation";
import { SignInForm } from "@/components/form/auth/sign-in";
import { verifySession } from "@/lib/dal";

export default async function SignInPage() {
  const session = await verifySession();

  if (session) {
    redirect("/");
  } else {
    return <SignInForm />;
  }
}
