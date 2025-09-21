"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { VerificationEmailSchema } from "@/zod/auth/verification-email"
import { auth } from "@/lib/auth"

import type { VerificationEmailFormData, VerificationEmailFormState } from "@/formdata/auth/verification-email"

export async function VerificationEmailAction(prevState: VerificationEmailFormState, formData: FormData,): Promise<VerificationEmailFormState> {
  const rawData: VerificationEmailFormData = {
    email: formData.get("email") as string,
  }

  const validated = VerificationEmailSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { email } = validated.data

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: `${process.env.BETTER_AUTH_URL}/`,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "A verification email has been sent to your email address. Please check your inbox.",
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
  }
}
