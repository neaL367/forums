import "./globals.css";
import { headers } from "next/headers";
import { Geist } from "next/font/google";

import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Toaster } from "@/ui/sonner";
import { auth } from "@/lib/auth";
import { SessionUser } from "./lib/db/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forums",
  description: "A simple forum app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as SessionUser | undefined;

  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased dark`}>
        <Header user={user} />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
