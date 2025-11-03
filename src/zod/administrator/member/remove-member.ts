import z from "zod";

export const RemoveMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});
