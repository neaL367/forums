"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

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

import { forgotUsernameAction } from "@/actions/auth/forgot-username";
import { authClient } from "@/lib/auth-client";

import type { ForgotUsernameFormState } from "@/formdata/auth/forgot-username";

const initialState: ForgotUsernameFormState = {
  success: false,
  message: "",
};

export function ForgotUsernameForm() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const [state, formAction, pending] = useActionState(
    forgotUsernameAction,
    initialState
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        router.push("/");
      } else {
        toast.error(state.message);
      }
    }
  }, [refetch, router, state]);

  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Forgot Username</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email address and we&apos;ll send you your username
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              defaultValue={state.inputs?.email ?? ""}
              className={state.errors?.email ? "border-red-500" : ""}
              required
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm">{state?.errors?.email[0]}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>Send Username</p>
            )}
          </Button>
        </form>

        <div className="mt-4">
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
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
