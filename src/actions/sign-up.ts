"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { SignUpFormData, SignUpFormState } from "@/models/auth";
import { signUpSchema } from "@/lib/definitions";
import { auth } from "@/lib/auth";

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
    };
  }

  const { username, email, password } = validated.data;

  try {
    await auth.api.signUpEmail({
      body: { name: username, username, displayUsername: username, email, password, role: "MEMBERS" },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      inputs: {}
    };
  } catch (err) {
    if (err instanceof APIError) {
      if (err.body?.code === 'USER_ALREADY_EXISTS' ||
        err.message?.toLowerCase().includes('user already exists')) {
        return {
          message: "An email address already exists.",
          inputs: rawData,
        };
      }

      return {
        message: err.body?.message ?? err.message ?? "An error occurred during sign-up",
        inputs: rawData,
      };
    }
    throw err
  }
}