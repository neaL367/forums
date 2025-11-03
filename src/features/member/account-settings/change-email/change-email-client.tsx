"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@/features/member/account-settings/shared/settings-form-skeleton";

export const EmailSettingsFormClient = dynamic(
  () => import("@/features/member/account-settings/change-email/change-email").then((mod) => ({ 
    default: mod.EmailSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);