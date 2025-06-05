import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../app/generated/prisma";

import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
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
    emailAndPassword: {
        enabled: true,
        autoSignInAfterSignUp: false,
        // requireEmailVerification: true,
    },
    // emailVerification: {
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    // }
    user: {
        additionalFields: {
            role: {
                type: ["MEMBERS", "ADMINISTRATOR", "MODERATOR", "GUEST", "OWNER", "STAFF"],
            }
        },
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
    plugins: [username(), nextCookies()],
})