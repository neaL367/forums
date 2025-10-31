import "server-only";

import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const sql = neon(process.env.DATABASE_URL!);

export const authServer = async () => {
  return await auth.api.getSession({ headers: await headers() });
};
