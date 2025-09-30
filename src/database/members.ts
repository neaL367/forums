import "server-only"

import { sql } from '@/lib/dal'
import type { Member, MemberProfile } from '@/types/member'

export const getAllMembersProfile = async (): Promise<Pick<Member, "id">[]> => {
  try {
    const rows = await sql`SELECT id FROM public.member;`
    return rows as Pick<Member, "id">[]
  } catch (error) {
    console.error("Error fetching all members (public):", error)
    throw new Error("Failed to fetch members")
  }
}

export const getMemberProfileById = async (id: string): Promise<MemberProfile> => {
  try {
    const rows = await sql`SELECT id, "displayUsername", image, role, bio, website, location,
               "createdAt", "updatedAt", "joinDate", "lastActive", "postCount", reputation
        FROM public.member WHERE id = ${id}
        LIMIT 1;
      `
    const user = rows[0] as MemberProfile
    if (!user) {
      throw new Error("User not found")
    }
    return user
  } catch (error) {
    console.error(`Error fetching member profile by ID (${id}):`, error)
    throw new Error("Failed to fetch member")
  }
}



export async function getMemberByUsername(query: string): Promise<MemberProfile[]> {
  try {
    // Use ILIKE for case-insensitive partial matching on displayUsername
    const rows = await sql`
      SELECT id, "displayUsername", image, role, bio, website, location,
             "createdAt", "updatedAt", "joinDate", "lastActive", "postCount", reputation
      FROM public.member
      WHERE "displayUsername" ILIKE ${`%${query}%`}
      ORDER BY "displayUsername" ASC;
    `;
    return rows as MemberProfile[];
  } catch (error) {
    console.error(`Error fetching members by username (${query}):`, error);
    throw new Error("Failed to fetch members");
  }
}


export const updateMemberProfile = async (
  id: string,
  updates: {
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    website?: string | null;
  }
): Promise<MemberProfile> => {
  try {
    const rows = await sql`
      UPDATE public.member 
      SET 
        image = COALESCE(${updates.image}, image),
        bio = COALESCE(${updates.bio}, bio),
        location = COALESCE(${updates.location}, location),
        website = COALESCE(${updates.website}, website),
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, image, role, bio, website, location,
                "createdAt", "updatedAt", "joinDate", "lastActive", "postCount", reputation
    `;

    const user = rows[0] as MemberProfile;

    if (!user) {
      throw new Error("Member not found or update failed");
    }

    return user;
  } catch (error) {
    console.error(`Error updating member profile by ID (${id}):`, error);
    throw new Error("Failed to update member profile");
  }
}