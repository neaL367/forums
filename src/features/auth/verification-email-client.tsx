"use client";

import dynamic from "next/dynamic";
import { AuthFormSkeleton } from "@features/auth/auth-form-skeleton";

export const VerificationEmailFormClient = dynamic(
  () => import("@features/auth/verification-email").then((mod) => ({ 
    default: mod.VerificationEmailForm 
  })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);