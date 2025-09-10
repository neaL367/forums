import { z } from "zod"

export const rolesSchema = z.enum(["MEMBERS", "ADMINISTRATOR", "MODERATOR", "OWNER", "STAFF", "GUEST"])

export const memberSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.string(),
  name: z.string(),
  username: z.string(),
  displayUsername: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  role: rolesSchema,
  bio: z.string().nullable(),
  website: z.string().nullable(),
  location: z.string().nullable(),
  postCount: z.number(),
  reputation: z.number(),
  banned: z.boolean(),
  banExpires: z.date().nullable(),
  banReason: z.string().nullable(),
})

export type Roles = z.infer<typeof rolesSchema>
export type Members = z.infer<typeof memberSchema>