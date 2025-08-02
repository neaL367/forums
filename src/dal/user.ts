import "server-only"

import { cache } from "react"
import type { User, UserProfile } from "@/types/user"
import { sql } from "@/lib/dal"


export const getAllUsersProfile = cache(async (): Promise<Pick<User, "id">[]> => {
  try {
    console.log("Fetching all users from database...")
    const rows = await sql`SELECT id FROM public.user;`
    return rows as Pick<User, "id">[]
  } catch (error) {
    console.error("Error fetching all users (public):", error)
    throw new Error("Failed to fetch users")
  }
})

export const getUserProfileById = cache(async (id: string): Promise<UserProfile> => {
  try {
    console.log(`Fetching user profile for ID: ${id}`)
    const rows = await sql`
      SELECT 
        id,
        "displayUsername",
        image,
        role,
        bio,
        website,
        location,
        "createdAt",
        "updatedAt",
        "joinDate",
        "lastActive",
        "postCount",
        reputation
      FROM public.user
      WHERE id = ${id}
      LIMIT 1;
    `
    
    const user = rows[0] as UserProfile
    if (!user) {
      throw new Error("User not found")
    }
    
    return user
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw new Error("Failed to fetch user")
  }
})
