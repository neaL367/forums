import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpAction } from "@/actions/auth/sign-up";
import { useForm } from "@/hooks/use-form";

import type { SignUpFormData, SignUpFormState } from "@/formdata/auth/sign-up";

const initialState: SignUpFormState = {
  success: false,
  message: "",
};

export function SignUpForm() {
  const { state, formAction, pending } = useForm<SignUpFormData>({
    action: signUpAction,
    initialState: initialState,
    loadingMessage: "Creating your account...",
    successRedirect: "/",
    awaitSession: true,
  });

  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="JaneDoe"
              defaultValue={state.inputs?.username ?? ""}
              className={state.errors?.username ? "border-red-500" : ""}
              required
            />
            {state?.errors?.username && (
              <div className="text-red-500 text-sm">
                {state.errors.username[0]}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="janedoe@example.com"
              defaultValue={state.inputs?.email ?? ""}
              className={state.errors?.email ? "border-red-500" : ""}
              required
            />
            {state?.errors?.email && (
              <div className="text-red-500 text-sm">
                {state.errors.email[0]}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              defaultValue={state.inputs?.password ?? ""}
              className={state.errors?.password ? "border-red-500" : ""}
              required
            />
            {state?.errors?.password && (
              <div className="text-red-500 text-sm">
                <p>Password must:</p>
                <ul className="list-disc list-inside">
                  {state.errors.password[0]}
                </ul>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              defaultValue={state.inputs?.passwordConfirmation ?? ""}
              className={
                state.errors?.passwordConfirmation ? "border-red-500" : ""
              }
              required
            />
            {state?.errors?.passwordConfirmation && (
              <div className="text-red-500 text-sm">
                {state.errors.passwordConfirmation[0]}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline text-foreground">
            Sign in
          </Link>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Powered by{" "}
            <Link
              href="https://better-auth.com"
              className="underline"
              target="_blank"
            >
              <span className="dark:text-orange-200/90">better-auth.</span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
