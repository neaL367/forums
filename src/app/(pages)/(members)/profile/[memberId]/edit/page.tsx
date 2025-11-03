import { notFound, redirect } from "next/navigation";

import { authServer } from "@/lib/auth-server";
import { getMemberProfileById } from "@/database/members";
import { EditProfile } from "@/features/profile/edit-profile";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ memberId: string }>;
}): Promise<Metadata> {
  const { memberId } = await params;
  if (!memberId) return { title: "Edit Profile" };

  const member = await getMemberProfileById(memberId);

  if (!member) return { title: "Edit Profile" };

  return {
    title: `Edit ${member.displayUsername}'s Profile`,
  };
}

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const session = await authServer();
  const { memberId } = await params;

  if (!memberId || !session?.user?.id) {
    redirect("/");
  }

  if (session.user.id !== memberId) {
    redirect(`/profile/${memberId}`);
  }

  const member = await getMemberProfileById(memberId);
  if (!member) {
    notFound();
  }

  return <EditProfile member={member} />;
}

