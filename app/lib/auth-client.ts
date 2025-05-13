import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    forgetPassword,
    resetPassword,
} = createAuthClient({

    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        usernameClient()
    ]
});