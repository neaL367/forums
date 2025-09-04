import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .max(20, { message: "Password is too long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Contain at least one special character" });

export const resetPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token is required" }),
    password: passwordSchema,
    passwordConfirmation: z
    .string()
    .min(8, { message: "Confirmation must be at least 8 characters" }),
}).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
});