"use client";

import dynamic from "next/dynamic";
import { SettingsFormSkeleton } from "@features/account-settings/settings-form-skeleton";

export const EmailSettingsFormClient = dynamic(
  () => import("@features/account-settings/email").then((mod) => ({ 
    default: mod.EmailSettingsForm 
  })),
  {
    loading: () => <SettingsFormSkeleton />,
    ssr: false,
  }
);