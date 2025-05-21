"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import {
  Lock,
  KeyRound,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ResetPasswordSchema } from "@/lib/definitions";
import { authClient } from "@/lib/auth-client";

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onBlur",
    defaultValues: { password: "", confirm_password: "" },
  });

  const onSubmit = async ({ password }: ResetPasswordInput) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        token,
        newPassword: password,
      });

      if (!result) {
        toast.error(result || "Failed to reset password");
      } else {
        setResetComplete(true);
        toast.success("Password reset successfully!");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invalid Reset Link
              </h1>
              <p className="text-red-500 mt-2">
                The password reset link is invalid or has expired.
              </p>
            </div>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full h-11 bg-yellow-500 hover:from-yellow-600 text-black font-medium rounded-md transition-all duration-200"
            >
              Request New Reset Link
            </Button>
            <div className="text-center pt-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="w-full max-w-md p-8 space-y-6 ">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new password for your account
          </p>
        </div>

        {!resetComplete ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  className={`pl-10 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  className={`pl-10 ${
                    errors.confirm_password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="••••••••"
                  {...register("confirm_password")}
                  aria-invalid={errors.confirm_password ? "true" : "false"}
                />
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-yellow-500 hover:from-yellow-600 text-black font-medium rounded-md transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Password Reset Complete
              </h3>
              <p className="text-muted-foreground">
                Your password has been reset successfully!
              </p>
              <p className="text-sm text-white">
                You can now sign in with your new password.
              </p>
            </div>
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full h-11 bg-yellow-500 hover:from-yellow-600 text-black font-medium rounded-md transition-all duration-200"
            >
              Sign In with New Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
