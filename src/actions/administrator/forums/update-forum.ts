"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/dal";
import { getForumDepth, updateForum } from "@/database/forums";
import { UpdateForumSchema } from "@/zod/administrator/update-forum";
import type { UpdateForumFormData, UpdateForumFormState } from "@/formdata/administrator/forums/update-forum";

export async function updateForumAction(
  prevState: UpdateForumFormState,
  formData: FormData
): Promise<UpdateForumFormState> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to edit forums.",
      };
    }

    const forumId = formData.get("forumId") as string;
    const rawData: UpdateForumFormData = {
      title: formData.get("title") as string || undefined,
      description: formData.get("description") as string || undefined,
      parentForumId: formData.get("parentForumId") as string || undefined,
    };

    const validated = UpdateForumSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Validation failed",
        success: false,
      };
    }

    const parentForumId =
      validated.data.parentForumId === "none" || !validated.data.parentForumId
        ? null
        : String(validated.data.parentForumId);

    if (parentForumId === forumId) {
      return {
        inputs: rawData,
        message: "A forum cannot be its own parent",
        success: false,
      };
    }

    if (parentForumId !== null) {
      const parentDepth = await getForumDepth(parentForumId);
      if (parentDepth >= 2) {
        return {
          inputs: rawData,
          message:
            "Cannot update forum: Maximum nesting depth (3 levels) would be exceeded",
          success: false,
        };
      }
    }

    await updateForum({
      id: forumId,
      title: validated.data.title,
      description: validated.data.description,
      parentForumId,
    });

    revalidateTag("admin-mgt-forums");

    return {
      message: "Forum updated successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error updating forum:", error);
    return {
      message: "Failed to update forum",
      success: false,
    };
  }
}
