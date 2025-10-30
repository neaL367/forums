"use server"

import { revalidateTag } from "next/cache";
import { authServer } from "@/lib/auth-server"
import { insertTopic } from "@/database/topics";
import { AddTopicSchema }  from "@/zod/administrator/topic/add-topic"
import type { AddTopicFormData, AddTopicFormState } from "@/formdata/administrator/topic/add-topic";

export async function addTopicAction(prevState: AddTopicFormState, formData: FormData): Promise<AddTopicFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: AddTopicFormData = {
      title: formData.get("title") as string,
      forumId: formData.get("forumId") as string,
    }

    const validated = AddTopicSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Validation failed",
        success: false,
      }
    }

    // Insert into database
    await insertTopic({
      title: validated.data.title,
      forumId: validated.data.forumId,
    })

    revalidateTag("admin-mgt-topics")
    revalidateTag("admin-mgt-forums")

    return {
      message: "Topic created successfully",
      success: true,
    }
  } catch (error) {
    console.error("Error creating topic:", error)
    return {
      message: "Failed to create topic",
      success: false,
    }
  }
}