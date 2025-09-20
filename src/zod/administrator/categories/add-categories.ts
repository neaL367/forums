import z from "zod";

export const AddCategoriesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().max(500, "Description too long."),
});
