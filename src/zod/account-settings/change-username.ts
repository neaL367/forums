import z from "zod";

export const ChangeUsernameSchema = z.object({
    displayUsername: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(16, { message: "Username cannot exceed 16 characters." })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Username can only contain letters, numbers, underscores, and hyphens.",
        })
        .trim()
})
