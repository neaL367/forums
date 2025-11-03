"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@/features/auth/shared/auth-form-skeleton";

export const SignInFormClient = dynamic(
  () => import("@/features/auth/sign-in/sign-in").then((mod) => ({ 
    default: mod.SignInForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);