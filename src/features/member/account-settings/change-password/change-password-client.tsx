"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@/features/member/account-settings/shared/settings-form-skeleton";

export const PasswordSettingsFormClient = dynamic(
  () => import("@/features/member/account-settings/change-password/change-password").then((mod) => ({ 
    default: mod.PasswordSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);