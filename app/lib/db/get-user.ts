import { sql } from "@/db/db"
import { User } from "@/db/schema"

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql`
    SELECT
      id,
      username,
      email,
      "emailVerified",
      "createdAt",
      "updatedAt",
      image,
      role,
      banned,
      "banReason",
      "banExpires",
      "displayUsername"
    FROM users
    WHERE id = ${id}
    LIMIT 1
  ` as User[];  

  if (rows.length === 0) return null;
  const row = rows[0];  // row is now RawUserRow, not any!

  // 3) Convert RAW strings → Date objects and return a fully‐typed User
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    banExpires: row.banExpires ? new Date(row.banExpires) : null,
  };
}


export async function getUserByUsername(username: string): Promise<User | null> {
  const rows = await sql`
    SELECT id, username, email
    FROM users
    WHERE username = ${username}
    LIMIT 1
  `
  return rows.length > 0 ? (rows[0] as User) : null
}

export async function getAllUsers(): Promise<User[]> {
  const rows = await sql`
    SELECT id, username, email
    FROM users
  `
  return rows as User[]
}