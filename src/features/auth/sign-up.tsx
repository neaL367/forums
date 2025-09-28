"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpAction } from "@/actions/auth/sign-up";
import { authClient } from "@/lib/auth-client";
import type { SignUpFormState } from "@/formdata/auth/sign-up";

const initialState: SignUpFormState = {
  success: false,
  message: "",
};

export function SignUpForm() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  
  // Track if we're waiting for a successful sign-up
  const [waitingForSession, setWaitingForSession] = useState(false);
  const loadingToastRef = useRef<string | number | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: SignUpFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Creating your account...");
      return await signUpAction(prevState, formData);
    },
    initialState
  );

  // Handle initial form response
  useEffect(() => {
    if (state?.message) {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
        loadingToastRef.current = null;
      }

      if (state.success) {
        setWaitingForSession(true);
        refetch();
      } else {
        toast.error(state.message);
      }
    }
  }, [refetch, state]);

  useEffect(() => {
    if (waitingForSession && session) {
      toast.success(state.message);
      router.push("/");
      router.refresh();
      setWaitingForSession(false);
    }
  }, [session, waitingForSession, state.message, router]);

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

          <Button type="submit" className="w-full" disabled={pending || waitingForSession}>
            {pending || waitingForSession ? (
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