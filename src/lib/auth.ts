import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@prisma/client";

import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignInAfterSignUp: true,
        requireEmailVerification: false,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEmail(user.email, url, user.name);
        },

    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail(user.email, url, user.name);
        },
    },
    user: {
        additionalFields: {
            role: {
                type: ["MEMBERS", "ADMINISTRATOR", "MODERATOR", "GUEST", "OWNER", "STAFF"],
                input: false
            }
        },
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
        // As a workaround, set updateAge to a large value for now.
        updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    plugins: [username(), nextCookies()],
})