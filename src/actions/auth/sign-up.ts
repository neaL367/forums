"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { signUpSchema } from "@/schemas/auth"
import { auth } from "@/lib/auth"

import type { SignUpFormData, SignUpFormState } from "@/models/auth/sign-up"

export async function signUpAction(prevState: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const rawData: SignUpFormData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirmation: formData.get("passwordConfirmation") as string,
  }

  const validated = signUpSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { username, email, password } = validated.data

  try {
    await auth.api.signUpEmail({
      body: {
        name: username,
        username,
        displayUsername: username,
        email,
        password,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      if (err.body?.code === "USER_ALREADY_EXISTS" || err.message?.toLowerCase().includes("user already exists")) {
        return {
          success: false,
          message: "An account with this email already exists.",
          inputs: rawData,
        }
      }

      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred during sign-up",
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
