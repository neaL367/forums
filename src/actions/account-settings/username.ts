"use server"

import { APIError } from "better-auth/api"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ChangeUsernameSchema } from "@/schemas/account-settings"
import { getUserProfileById } from "@/dal/user"

import type { ChangeUsernameFormData, ChangeUsernameFormState } from "@/models/account-setting/username"
import { verifySession } from "@/lib/dal"

export async function UsernameSettingsAction(
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
    const session = await verifySession();

    const user = await getUserProfileById(session?.user.id ?? "")

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
        username: displayUsername,
        name: displayUsername,
      },
      headers: await headers(),
    })

    revalidateTag("profile")

    return {
      success: true,
      message: "Username updated successfully!",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred while updating username.",
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
