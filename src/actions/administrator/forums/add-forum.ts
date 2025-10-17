"use server"

import { revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/dal"
import { AddForumSchema } from "@/zod/administrator/add-forum"
import { getForumDepth, insertForum } from "@/database/forums";
import type { AddForumFormData, AddForumFormState } from "@/formdata/administrator/forums/add-forum"

export async function addForumAction(prevState: AddForumFormState, formData: FormData): Promise<AddForumFormState> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to add categories.",
      };
    }

    const rawData: AddForumFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      parentForumId: formData.get("parentForumId") as string | undefined,
    }

    const validated = AddForumSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Validation failed",
        success: false,
      }
    }

    // Convert "none" to null for parentForumId
    const parentForumId =
      validated.data.parentForumId === "none" || !validated.data.parentForumId
        ? null
        : String(validated.data.parentForumId)

    if (parentForumId !== null) {
      const parentDepth = await getForumDepth(parentForumId)
      if (parentDepth >= 2) {
        return {
          inputs: rawData,
          message: "Cannot create forum: Maximum nesting depth (3 levels) would be exceeded",
          success: false,
        }
      }
    }

    // Insert into database
    await insertForum({
      title: validated.data.title,
      description: validated.data.description,
      parentForumId,
    })

    revalidateTag("admin-mgt-forums")


    return {
      message: "Forum created successfully",
      success: true,
    }
  } catch (error) {
    console.error("Error creating forum:", error)
    return {
      message: "Failed to create forum",
      success: false,
    }
  }
}