"use server"

import { UserDAL } from "@/dal/user"
import type { User } from "@/models/user"

export async function getAllUsers(): Promise<User[]> {
  return await UserDAL.getAllUsers()
}

export async function getUserById(id: string): Promise<User | null> {
  if (!id) {
    throw new Error("User ID is required")
  }
  return await UserDAL.getUserById(id)
}

export async function getUserByUsername(username: string): Promise<User | null> {
  if (!username) {
    throw new Error("Username is required")
  }
  return await UserDAL.getUserByUsername(username)
}