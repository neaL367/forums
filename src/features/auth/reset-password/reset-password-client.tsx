"use client"

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@/features/auth/shared/auth-form-skeleton";

export const ResetPasswordFormClient = dynamic(
  () => import("@/features/auth/reset-password/reset-password").then((mod) => ({ 
    default: mod.ResetPasswordForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);