import "server-only"

import { neon } from "@neondatabase/serverless"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const sql = neon(process.env.DATABASE_URL!)

export async function verifySession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}