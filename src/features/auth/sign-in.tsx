"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef } from "react";
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

import { signInAction } from "@/actions/auth/sign-in";
import { authClient } from "@/lib/auth-client";
import type { SignInFormState } from "@/formdata/auth/sign-in";

const initialState: SignInFormState = {
  success: false,
  message: "",
};

export function SignInForm() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const loadingToastRef = useRef<string | number | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: SignInFormState, formData: FormData) => {
      loadingToastRef.current = toast.loading("Signing in...");
      return await signInAction(prevState, formData);
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
        toast.success(state.message);
        router.push("/");
        router.refresh();
        refetch();
      } else {
        toast.error(state.message);
      }
    }
  }, [refetch, router, state]);

  return (
    <Card className="z-50 rounded-md rounded-t-none min-w-lg">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your username and password to login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={formAction}>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="username">Username</Label>
              <Link href="/auth/forgot-username" className="text-sm underline">
                Forgot username?
              </Link>
            </div>
            <Input
              id="username"
              name="username"
              placeholder="JaneDoe"
              defaultValue={state.inputs?.username ?? ""}
              className={state.errors?.username ? "border-red-500" : ""}
              required
            />
            {state?.errors?.username && (
              <p className="text-red-500 text-sm">
                {state?.errors?.username[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-sm underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              defaultValue={state.inputs?.password ?? ""}
              className={state.errors?.password ? "border-red-500" : ""}
              required
            />
            {state.errors?.password && (
              <p className="text-red-500 text-sm">
                {state.errors?.password[0]}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <p>Login</p>
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline text-foreground">
            Sign up
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