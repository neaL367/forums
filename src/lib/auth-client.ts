import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@lib/auth"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        usernameClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})
