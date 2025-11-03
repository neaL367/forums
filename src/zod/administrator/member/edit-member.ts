import z from "zod";

export const EditMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username cannot exceed 16 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and hyphens.",
    })
    .trim(),
  displayUsername: z
    .string()
    .min(1, "Display username is required")
    .max(50, "Display username cannot exceed 50 characters")
    .trim(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
}).transform((data) => ({
  ...data,
  image: data.image === "" ? undefined : data.image,
}));
