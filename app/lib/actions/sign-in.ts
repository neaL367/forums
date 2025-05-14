"use server"

import { APIError } from "better-auth/api"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SigninFormSchema, SignInFormState } from "@/lib/difinitions"

export async function signIn(prevState: SignInFormState, formData: FormData): Promise<SignInFormState> {
  const validatedFields = SigninFormSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      payload: formData,
    }
  }

  const { identifier, password } = validatedFields.data

  try {
    if (identifier.includes("@")) {
      await auth.api.signInEmail({
        body: { email: identifier, password },
      })
    } else {
      await auth.api.signInUsername({
        body: { username: identifier, password },
      })
    }
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { formError: "User not found or incorrect password." }
        case "FORBIDDEN":
          return { formError: "Please verify your email address before signing in." }
        case "BAD_REQUEST":
          return { formError: "Invalid email format." }
        default:
          return { formError: "Something went wrong. Please try again." }
      }
    }
    throw error
  }

  redirect("/")
}
