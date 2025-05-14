import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

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