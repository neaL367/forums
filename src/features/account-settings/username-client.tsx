"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@features/account-settings/settings-form-skeleton";

export const UsernameSettingsFormClient = dynamic(
  () => import("@features/account-settings/username").then((mod) => ({ 
    default: mod.UsernameSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);