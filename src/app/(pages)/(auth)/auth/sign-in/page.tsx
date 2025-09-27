import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth/sign-in";
import { getServerSession } from "@/lib/dal";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  } else {
    return <SignInForm />;
  }
}
