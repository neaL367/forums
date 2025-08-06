import z from "zod";

const emailSchema = z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email." })
    .refine((val: string) => val === val.toLowerCase(), {
        message: "Email must be all lowercase",
    })
    .transform((val: string) => val.toLowerCase());

export const forgotUsernameSchema = z.object({
    email: emailSchema,
})