"use server"

import { APIError } from "better-auth/api"
import { headers } from "next/headers"

import { signInSchema } from "@/schemas/auth"
import { auth } from "@/lib/auth"

import type { SignInFormData, SignInFormState } from "@/models/auth/sign-in"

export async function signInAction(prevState: SignInFormState, formData: FormData): Promise<SignInFormState> {
  const rawData: SignInFormData = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }

  const validated = signInSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { username, password } = validated.data

  try {
    await auth.api.signInUsername({
      body: { username, password },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Signed in successfully!",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {
      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred during sign-in",
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
