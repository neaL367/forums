import { betterAuth, BetterAuthOptions } from "better-auth";
import { admin, customSession, username } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

import { sendChangeEmailVerification, sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email";
import { ac, roles } from "@lib/permissions";

const prisma = new PrismaClient();

const options = {
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    emailAndPassword: {
        enabled: true,
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
        modelName: "Member",
        additionalFields: {
            role: {
                type: ["MEMBERS", "ADMINISTRATOR", "MODERATOR", "GUEST", "OWNER", "STAFF"],
                input: false
            }
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url }) => {
                await sendChangeEmailVerification(user.email, url, user.name)
            }
        }
    },
    account: {
        modelName: "Account",
        fields: {
            userId: "memberId",
        },
    },
    verification: {
        modelName: "Verification",
    },
    session: {
        modelName: "Session",
        fields: {
            userId: "memberId",
        },
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
        // As a workaround, set updateAge to a large value for now.
        updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
        // cookieCache: {
        //     enabled: process.env.NODE_ENV === 'production',
        //     maxAge: 5 * 60,
        // },
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
    plugins: [
        username(),
        nextCookies(),
        admin({
            defaultRole: "MEMBERS",
            adminRoles: ["ADMINISTRATOR"],
            ac,
            roles,
            impersonationSessionDuration: 60 * 60 * 24, // 1 day
        }),
    ],

} satisfies BetterAuthOptions;

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }) => {
            return {
                session: {
                    ...session
                },
                user: {
                    ...user
                },
            };
        }, options),
    ],
});

export type Session = typeof auth.$Infer.Session;
export type Member = typeof auth.$Infer.Session.user;