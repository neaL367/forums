"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@features/auth/auth-form-skeleton";

export const ForgotPasswordFormClient = dynamic(
  () => import("@features/auth/forgot-password").then((mod) => ({ 
    default: mod.ForgotPasswordForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);