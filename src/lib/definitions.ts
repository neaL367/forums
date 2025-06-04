import z from "zod";

const passwordSchema = z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .max(20, { message: "Password is too long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Contain at least one special character" });

export const signUpSchema = z
    .object({
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long." })
            .max(16, { message: "Username cannot exceed 16 characters." })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message: "Username can only contain letters, numbers, underscores, and hyphens.",
            })
            .trim(),
        email: z
            .string()
            .trim()
            .min(1, { message: "Email is required" })
            .email({ message: "Please enter a valid email." })
            .refine((val: string) => val === val.toLowerCase(), {
                message: "Email must be all lowercase",
            })
            .transform((val: string) => val.toLowerCase()),
        password: passwordSchema,
        passwordConfirmation: z
            .string()
            .min(8, { message: "Confirmation must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "Passwords do not match",
    });

export const signInSchema = z.object({
    username: z.string().min(1, { message: "Username or email is required" }).trim(),
    password: z.string().min(1, { message: "Password is required" }).trim(),
    // rememberMe: z.boolean().optional(),
});

