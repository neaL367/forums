import "server-only"

import { neon } from "@neondatabase/serverless"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { auth } from "@/lib/auth"

export const sql = neon(process.env.DATABASE_URL!)

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return { isAuthenticaton: true, session: session, user: session.user }
})
