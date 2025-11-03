import z from "zod";

export const BanMemberSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  banReason: z.string().optional(),
  banExpiresIn: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = Number.parseInt(val, 10);
      return Number.isNaN(num) ? undefined : num;
    })
    .pipe(z.number().positive().optional()),
});
