"use server"

import { APIError } from "better-auth/api"
import { updateTag } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { authServer } from "@/lib/auth-server"
import { getMemberProfileById } from "@/database/members"
import { ChangeUsernameSchema } from "@/zod/account-settings/change-username"

import type { ChangeUsernameFormData, ChangeUsernameFormState } from "@/formdata/account-setting/change-username"

export async function changeUsernameAction(
  prevState: ChangeUsernameFormState,
  formData: FormData,
): Promise<ChangeUsernameFormState> {
  const rawData: ChangeUsernameFormData = {
    displayUsername: formData.get("displayUsername") as string,
  }

  const validated = ChangeUsernameSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { displayUsername } = validated.data

  try {
    const session = await authServer();

    const user = await getMemberProfileById(session?.user.id ?? "")

    if (!session || session.user.id !== user.id) {
      return {
        success: false,
        message: "Unauthorized: You can only update your own username.",
        inputs: rawData,
      }
    }

    await auth.api.updateUser({
      body: {
        displayUsername: displayUsername,
      },
      headers: await headers(),
    })

    updateTag("profile")

    return {
      success: true,
      message: "Username updated successfully!",
      inputs: {},
    }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.body?.message ?? error.message ?? "An error occurred while updating username.",
        inputs: rawData,
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
  }
}
