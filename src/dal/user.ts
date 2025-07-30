"server only"

import { User } from '@/models/user';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getAllUsers() {
  const rows = await sql`SELECT * FROM public.user;`;
  return rows as User[];
}

export async function getUserByUsername(username: string) {
  const rows = await sql`SELECT * FROM public.user WHERE username = ${username} LIMIT 1;`;
  return rows[0];
}