import { sql } from "@/db/db";

export async function searchUsername(email: string): Promise<string | null> {
  const raw = await sql`
    SELECT username
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  const result = raw as { username: string }[];

  if (result.length === 0) return null;
  return result[0].username;
}
