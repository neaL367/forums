import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password is too long");

export const SetPasswordSchema = z
  .object({
    memberId: z.string().min(1, "Member ID is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(8, "Confirmation must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
