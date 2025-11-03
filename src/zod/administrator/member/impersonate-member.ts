import z from "zod";

export const ImpersonateMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});
