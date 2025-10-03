"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@features/auth/auth-form-skeleton";

export const SignUpFormClient = dynamic(
  () => import("@features/auth/sign-up").then((mod) => ({ 
    default: mod.SignUpForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);