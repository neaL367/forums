import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/actions/send-email";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient()

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                html: `<p>Please verify by clicking <a href="${url}">here</a>.</p>`,
                text: `Please verify by visiting: ${url}`,
            });
        },
        sendOnSignUp: true,
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Reset your password',
                html: `<p>Reset your password by clicking <a href="${url}">here</a>.</p>`,
                text: `Reset your password: ${url}`,
            });
        },
        requireEmailVerification: false,
        resetPasswordTokenExpiresIn: 300, // 5 min
    },
    user: {
        modelName: "users",
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds
        },
    },
    plugins: [
        username({
            minUsernameLength: 3,
            maxUsernameLength: 16
        }),
        nextCookies()
    ],
});