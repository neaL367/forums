"use server"

import { APIError } from "better-auth/api"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ChangeEmailFormData, ChangeEmailFormState } from "@/models/account-setting/email"
import { ChangeEmailSchema } from "@/schemas/account-settings"


export async function EmailSettingsAction(
  prevState: ChangeEmailFormState,
  formData: FormData,
): Promise<ChangeEmailFormState> {
  const rawData: ChangeEmailFormData = {
    newEmail: formData.get("email") as string,
  }

  const validated = ChangeEmailSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { newEmail } = validated.data

  try {

    await auth.api.changeEmail({
      body: {
        newEmail: newEmail,
        callbackURL: "/account-settings"
      },
      headers: await headers(),
    })

    revalidateTag("profile")

    return {
      success: true,
      message: "A verification email will be sent to this address.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred while updating Email.",
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
