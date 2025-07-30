"server only";

import { neon } from "@neondatabase/serverless"
import type { User } from "@/models/user"

const sql = neon(process.env.DATABASE_URL!)

export class UserDAL {
  static async getAllUsers(): Promise<User[]> {
    try {
      const rows = await sql`SELECT * FROM public.user;`
      return rows as User[]
    } catch (error) {
      console.error("Error fetching all users:", error)
      throw new Error("Failed to fetch users")
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const rows = await sql`SELECT * FROM public.user WHERE id = ${id} LIMIT 1;`
      return (rows[0] as User) || null
    } catch (error) {
      console.error("Error fetching user by ID:", error)
      throw new Error("Failed to fetch user")
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const rows = await sql`SELECT * FROM public.user WHERE username = ${username} LIMIT 1;`
      return (rows[0] as User) || null
    } catch (error) {
      console.error("Error fetching user by username:", error)
      throw new Error("Failed to fetch user")
    }
  }
}