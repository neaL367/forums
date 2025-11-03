import z from "zod";

export const RevokeSessionSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
});
