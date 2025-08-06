"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { resetPasswordSchema } from "@/schemas/auth/reset-password"
import { auth } from "@/lib/auth"

import type { ResetPasswordFormData, ResetPasswordFormState } from "@/models/auth/reset-password"

export async function resetPasswordAction(prevState: ResetPasswordFormState, formData: FormData,): Promise<ResetPasswordFormState> {
  const rawData: ResetPasswordFormData = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    passwordConfirmation: formData.get("passwordConfirmation") as string,
  }

  const validated = resetPasswordSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { password, token } = validated.data

  if (!token) {
    return {
      success: false,
      message: "Invalid or missing reset token. Please request a new password reset.",
      inputs: rawData,
    }
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token: token,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Your password has been successfully reset. You can now sign in with your new password.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      const errorMessage = err.body?.message ?? err.message ?? "An error occurred during password reset."

      if (errorMessage.toLowerCase().includes("token")) {
        return {
          success: false,
          message: "The reset token is invalid or has expired. Please request a new password reset.",
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
