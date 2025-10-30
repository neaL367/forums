import z from "zod";

export const AddTopicSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  forumId: z.string(),
})