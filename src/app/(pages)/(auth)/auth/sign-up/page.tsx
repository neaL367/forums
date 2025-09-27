import { redirect } from "next/navigation";
import { SignUpForm } from "@/features/auth/sign-up";
import { getServerSession } from "@/lib/dal";

export default async function SignUpPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  } else {
    return <SignUpForm />;
  }
}
