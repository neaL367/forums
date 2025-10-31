"use client";

import dynamic from "next/dynamic";

interface AdministratorHeaderProps {
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
}

export const AdministratorHeader = dynamic(
  () =>
    import("@features/administrator/shared/admnistrator-header").then(
      (mod) => mod.AdministratorHeader
    ),
  {
    ssr: false,
    loading: () => (
      <header className="flex mb-6 h-20 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-6 w-px bg-muted" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </header>
    ),
  }
) as React.ComponentType<AdministratorHeaderProps>;

