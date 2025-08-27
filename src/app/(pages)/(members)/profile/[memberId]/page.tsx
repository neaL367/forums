import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"

import { verifySession } from "@/lib/dal"
import { getUserProfileById } from "@/database/user"
import { Profile } from "@/components/pages/profile/profile"

import type { MemberProfile } from "@/types/member"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const { memberId } = await params
  if (!memberId) return { title: "Profile Not Found" }

  const member: Pick<MemberProfile, "displayUsername"> = await getUserProfileById(memberId)

  if (!member) return { title: "Profile Not Found" }

  return {
    title: `${member.displayUsername}'s Profile`,
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ memberId: string }>
}) {
  const session = await verifySession()
  const { memberId } = await params

  if (!memberId) return notFound()

  const getCachedUserProfile = unstable_cache(async (memberId) => getUserProfileById(memberId), [memberId], {
    tags: ["profile"],
    revalidate: 60,
  })

  const member = await getCachedUserProfile(memberId)
  if (!member) return notFound()

  const isOwnProfile = session?.user?.id === memberId

  return <Profile member={member} isOwnProfile={isOwnProfile} />
}
