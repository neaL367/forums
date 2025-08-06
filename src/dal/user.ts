import "server-only"

import { sql } from '@/lib/dal'
import type { User, UserProfile } from '@/types/user'

export const getAllUsersProfile = (async (): Promise<Pick<User, "id">[]> => {
  try {
    const rows = await sql`SELECT id FROM public.user;`
    return rows as Pick<User, "id">[]
  } catch (error) {
    console.error("Error fetching all users (public):", error)
    throw new Error("Failed to fetch users")
  }
}
)

export const getUserProfileById = (async (id: string): Promise<UserProfile> => {
  try {
    const rows = await sql`
        SELECT id, "displayUsername", image, role, bio, website, location,
               "createdAt", "updatedAt", "joinDate", "lastActive", "postCount", reputation
        FROM public.user WHERE id = ${id}
        LIMIT 1;
      `
    const user = rows[0] as UserProfile
    if (!user) {
      throw new Error("User not found")
    }
    return user
  } catch (error) {
    console.error(`Error fetching user profile by ID (${id}):`, error)
    throw new Error("Failed to fetch user")
  }
}
)


export const updateUserProfile = async (
  id: string,
  updates: {
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    website?: string | null;
  }
): Promise<UserProfile> => {
  try {
    const rows = await sql`
      UPDATE public.user 
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
    
    const user = rows[0] as UserProfile;
    
    if (!user) {
      throw new Error("User not found or update failed");
    }
    
    return user;
  } catch (error) {
    console.error(`Error updating user profile by ID (${id}):`, error);
    throw new Error("Failed to update user profile");
  }
}