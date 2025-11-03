import z from "zod";

export const UnbanMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});
