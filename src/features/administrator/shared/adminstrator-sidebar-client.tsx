"use client";

import dynamic from "next/dynamic";

export const AdministratorSidebar = dynamic(
  () =>
    import("@features/administrator/shared/adminstrator-sidebar").then(
      (mod) => ({ default: mod.AdministratorSidebar })
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-64 h-screen border-r border-sidebar-border/50 animate-pulse" />
    ),
  }
);

