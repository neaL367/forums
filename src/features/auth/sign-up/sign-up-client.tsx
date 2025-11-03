"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@/features/auth/shared/auth-form-skeleton";

export const SignUpFormClient = dynamic(
  () => import("@/features/auth/sign-up/sign-up").then((mod) => ({ 
    default: mod.SignUpForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);