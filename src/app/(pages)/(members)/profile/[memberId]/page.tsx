import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { verifySession } from "@/lib/dal";
import { getMemberProfileById } from "@/database/members";
import { ProfileClient } from "@/features/profile/profile-client";

import type { MemberProfile } from "@/types/members";
import type { Metadata } from 'next'

export async function generateMetadata(props: PageProps<"/profile/[memberId]">): Promise<Metadata> {
  const { memberId } = await props.params;
  if (!memberId) return { title: "Profile Not Found" };

  const member: Pick<MemberProfile, "displayUsername"> =
    await getMemberProfileById(memberId);

  if (!member) return { title: "Profile Not Found" };

  return {
    title: `${member.displayUsername}'s Profile`,
  };
}

export default async function ProfilePage(props: PageProps<"/profile/[memberId]">) {
  const session = await verifySession();
  const { memberId } = await props.params;

  if (!memberId) return notFound();

  const isOwnProfile = session?.user?.id === memberId;

  const getCachedUserProfile = unstable_cache(
    async (memberId: string) => getMemberProfileById(memberId),
    [memberId],
    { tags: ["profile"], revalidate: 300 }
  );

  const member = await getCachedUserProfile(memberId);
  if (!member) return notFound();

  return <ProfileClient member={member} isOwnProfile={isOwnProfile} />;
}
