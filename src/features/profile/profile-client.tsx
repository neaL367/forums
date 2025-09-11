"use client";

import dynamic from "next/dynamic";

import type { MemberProfile } from "@/types/members";

const Profile = dynamic(
  () => import("@/features/profile/profile").then(m => m.Profile),
  { ssr: false }
);

interface ProfileClientProps {
  member: MemberProfile;
  isOwnProfile: boolean;
}

export function ProfileClient({ member, isOwnProfile }: ProfileClientProps) {
  return <Profile member={member} isOwnProfile={isOwnProfile} />;
}
