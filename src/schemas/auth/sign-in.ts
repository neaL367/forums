import z from "zod";

export const signInSchema = z.object({
    username: z.string().min(1, { message: "Username or email is required" }).trim(),
    password: z.string().min(1, { message: "Password is required" }).trim(),
    // rememberMe: z.boolean().optional(),
});
