import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.CONNECTION_STRING
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        modelName: "users",      
        fields: {
            id: "id",    
            email: "email",
            image: "avatar_url",
            createdAt: "created_at",
            updatedAt: "last_login"
        },
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
})