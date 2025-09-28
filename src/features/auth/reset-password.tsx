"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef, useState } from "react";
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

import { authClient } from "@/lib/auth-client";
import { resetPasswordAction } from "@/actions/auth/reset-password";
import type { ResetPasswordFormState } from "@/formdata/auth/reset-password";

const initialState: ResetPasswordFormState = {
  success: false,
  message: "",
};

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  const [waitingForSession, setWaitingForSession] = useState(false);
  const loadingToastRef = useRef<string | number | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: ResetPasswordFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Resetting your password...");
      return await resetPasswordAction(prevState, formData);
    },
    initialState
  );

  useEffect(() => {
    if (state?.message) {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
        loadingToastRef.current = null;
      }

      if (state.success) {
        setWaitingForSession(true);
        refetch();

        if (waitingForSession) {
          toast.success(state.message);
          router.push("/");
          setWaitingForSession(false);
        }
      } else {
        toast.error(state.message);
      }
    }
  }, [refetch, state, waitingForSession, router]);

  useEffect(() => {
    if (waitingForSession && session) {
      toast.success(state.message);
      router.push("/");
      setWaitingForSession(false);
    }
  }, [session, waitingForSession, state.message, router]);

  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={formAction}>
          <input type="hidden" name="token" value={token} />

          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              className={state.errors?.password ? "border-red-500" : ""}
              defaultValue={state.inputs?.password ?? ""}
              placeholder="Enter your new password"
              autoComplete="password"
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm">
                {state?.errors?.password[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              className={
                state.errors?.passwordConfirmation ? "border-red-500" : ""
              }
              defaultValue={state.inputs?.passwordConfirmation ?? ""}
              placeholder="Confirm your new password"
              autoComplete="passwordConfirmation"
            />
            {state?.errors?.passwordConfirmation && (
              <p className="text-red-500 text-sm">
                {state?.errors?.passwordConfirmation[0]}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={pending || waitingForSession}
          >
            {pending || waitingForSession ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>Reset Password</p>
            )}
          </Button>
        </form>
        <div className="mt-4">
          <Link href="/auth/sign-in" className="w-full">
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
