"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

import { signIn } from "@/actions/sign-in";
import { SignInFormState } from "@/lib/difinitions";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInFormState, FormData>(signIn, {});

  return (
    <div className="space-y-4 w-full max-w-md mx-auto p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <p className="text-muted-foreground">Username or email and password</p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Username or Email</Label>
          <Input
            id="identifier"
            name="identifier"
            className={state?.fieldErrors?.identifier ? "border-red-500" : ""}
          />
          {state?.fieldErrors?.identifier && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.identifier[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            className={state?.fieldErrors?.password ? "border-red-500" : ""}
          />
          {state?.fieldErrors?.password && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        {state?.formError && (
          <p className="text-red-500 text-center">{state.formError}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="flex justify-between text-sm mt-4">
        <Link href="/forgot-username" className="text-blue-500 hover:underline">
          Forgot Username?
        </Link>
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot Password?
        </Link>
      </div>
      
    </div>
  );
}
