import "server-only"

import { neon } from "@neondatabase/serverless"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// if (process.env.NODE_ENV === "development") {
//   neonConfig.fetchEndpoint = "http://localhost:5432/sql"
//   neonConfig.useSecureWebSocket = false
//   neonConfig.poolQueryViaFetch = true
// }

export const sql = neon(process.env.DATABASE_URL!)

export async function verifySession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}