"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@features/account-settings/settings-form-skeleton";

export const PasswordSettingsFormClient = dynamic(
  () => import("@features/account-settings/password").then((mod) => ({ 
    default: mod.PasswordSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);