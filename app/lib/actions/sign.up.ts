"use server"

import { APIError } from "better-auth/api"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SignupFormSchema, SignUpFormState } from "@/lib/difinitions"

export async function signUp(prevState: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  })

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      payload: formData,
    }
  }

  const { username, email, password } = validatedFields.data

  try {
    await auth.api.signUpEmail({
      body: {
        name: username,
        username,
        email,
        password,
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return {
            fieldErrors: {
              email: ["User already exists with this email."],
            },
          }
        case "BAD_REQUEST":
          return {
            fieldErrors: {
              email: ["Invalid email format."],
            },
          }
        default:
          return { formError: "Something went wrong." }
      }
    }
    console.error("sign up with email and password has not worked", error)
    throw error
  }

  redirect("/")
}