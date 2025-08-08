"use server"

import { APIError } from "better-auth/api"

import { sendUsernameReminderEmail } from "@/lib/email"
import { forgotUsernameSchema } from "@/schemas/auth/forgot-username"
import { forgotUsername } from "@/dal/auth"

import type { ForgotUsernameFormData, ForgotUsernameFormState } from "@/models/auth/forgot-username"
import type { Member } from "@/types/member"


export async function forgotUsernameAction(prevState: ForgotUsernameFormState, formData: FormData,): Promise<ForgotUsernameFormState> {
  const rawData: ForgotUsernameFormData = {
    email: formData.get("email") as string,
  }

  const validated = forgotUsernameSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { email } = validated.data

  try {
    const member : Member = await forgotUsername(email)

    if (!member) {
      return {
        success: false,
        message: "Your email address is not associated with any account.",
        inputs: {},
      }
    }

    await sendUsernameReminderEmail(member.email, member.username, member.name)

    return {
      success: true,
      message: "If an account with that email exists, we've sent you an email with your username.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred during the request.",
        inputs: rawData,
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
    // throw err
  }
}
