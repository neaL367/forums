import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { verifySession } from "@/lib/dal";
import { getMemberProfileById } from "@/database/members";
import { ProfileClient } from "@/components/pages/profile/profile-client";

import type { MemberProfile } from "@/types/member";
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ memberId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { memberId } = await params;
  if (!memberId) return { title: "Profile Not Found" };

  const member: Pick<MemberProfile, "displayUsername"> =
    await getMemberProfileById(memberId);

  if (!member) return { title: "Profile Not Found" };

  return {
    title: `${member.displayUsername}'s Profile`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const session = await verifySession();
  const { memberId } = await params;

  if (!memberId) return notFound();

  const getCachedUserProfile = unstable_cache(
    async (memberId: string) => getMemberProfileById(memberId),
    [memberId],
    { tags: ["profile"], revalidate: 60 }
  );

  const member = await getCachedUserProfile(memberId);
  if (!member) return notFound();

  const isOwnProfile = session?.user?.id === memberId;

  return <ProfileClient member={member} isOwnProfile={isOwnProfile} />;
}
