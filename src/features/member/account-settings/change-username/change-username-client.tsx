"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@/features/member/account-settings/shared/settings-form-skeleton";

export const UsernameSettingsFormClient = dynamic(
  () => import("@/features/member/account-settings/change-username/change-username").then((mod) => ({ 
    default: mod.UsernameSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);