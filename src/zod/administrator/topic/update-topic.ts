import z from "zod";

export const UpdateTopicSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
  forumId: z.string().optional(),
})