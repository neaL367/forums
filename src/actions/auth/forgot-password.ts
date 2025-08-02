"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { forgotPasswordSchema } from "@/schemas/auth"
import { auth } from "@/lib/auth"

import type { ForgotPasswordFormData, ForgotPasswordFormState } from "@/models/auth/forgot-password"

export async function forgotPasswordAction(prevState: ForgotPasswordFormState, formData: FormData,): Promise<ForgotPasswordFormState> {
  const rawData: ForgotPasswordFormData = {
    email: formData.get("email") as string,
  }

  const validated = forgotPasswordSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }
  const { email } = validated.data

  try {
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "A password reset link has been sent to your email address.",
      inputs: {},
    }
  } catch (err) {
    console.error("Better Auth forgetPassword error:", err)

    if (err instanceof APIError) {
      const errorMessage = err.body?.message ?? err.message ?? "An error occurred during the request."

      if (errorMessage.includes("User not found")) {
        return {
          success: false,
          message: "No account found with that email address.",
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
