import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db/db";
import * as schema from "@/db/schema";
import { sendVerificationEmail, sendResetPasswordEmail } from "@/app/lib/actions/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verification,
    },
  }),
  advanced: { database: { generateId: false } },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url, user.name);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    emailVerificationTokenExpiresIn: 3600, // 1 hour
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url, user.name);
    },
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  plugins: [username(), nextCookies()],
});
