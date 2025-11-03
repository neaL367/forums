"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ResetPasswordFormClient } from "@/features/auth/reset-password/reset-password-client";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <Card className="z-50 rounded-md min-w-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Invalid Reset Link
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please request a new password reset{" "}
            <Link href="/auth/forgot-password" className="text-white underline">
              link
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  return <ResetPasswordFormClient token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
