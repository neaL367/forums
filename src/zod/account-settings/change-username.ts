import z from "zod";

export const ChangeUsernameSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(16, { message: "Username cannot exceed 16 characters." })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Username can only contain letters, numbers, underscores, and hyphens.",
        })
        .trim(),
    displayUsername: z
        .string()
        .min(3, { message: "Display username must be at least 3 characters long." })
        .max(16, { message: "Display username cannot exceed 16 characters." })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Display username can only contain letters, numbers, underscores, and hyphens.",
        })
        .trim()
})
