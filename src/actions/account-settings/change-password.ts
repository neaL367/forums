"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { ChangePasswordSchema } from "@/zod/account-settings/change-password"
import type { ChangePasswordFormData, ChangePasswordFormState } from "@/formdata/account-setting/change-password"


export async function ChangePasswordAction(prevState: ChangePasswordFormState, formData: FormData,): Promise<ChangePasswordFormState> {
  const rawData: ChangePasswordFormData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    newPasswordConfirmation: formData.get("newPasswordConfirmation") as string,
  }

  const validated = ChangePasswordSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { currentPassword, newPassword } = validated.data

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Your password has been successfully change. You can now sign in with your new password.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      const errorMessage = err.body?.message ?? err.message ?? "An error occurred during password change."

      if (errorMessage.toLowerCase().includes("token")) {
        return {
          success: false,
          message: "The change token is invalid or has expired. Please request a new password change.",
          inputs: rawData,
        }
      }

      return {
        success: false,
        message: errorMessage,
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
