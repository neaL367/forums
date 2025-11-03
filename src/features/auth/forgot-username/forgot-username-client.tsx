"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@/features/auth/shared/auth-form-skeleton";

export const ForgotUsernameFormClient = dynamic(
  () => import("@/features/auth/forgot-username/forgot-username").then((mod) => ({ 
    default: mod.ForgotUsernameForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);