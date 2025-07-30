"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { SignInFormData, SignInFormState } from "@/models/auth";
import { signInSchema } from "@/lib/definitions";
import { auth } from "@/lib/auth";

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
    };
  }

  const { username, password } = validated.data;

  try {
    await auth.api.signInUsername({
      body: { username, password },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Signed in successfully!",
      inputs: {},
    };
  } catch (err) {
    if (err instanceof APIError) {
      return {
        message: err.body?.message ?? err.message ?? "An error occurred during sign-up",
        inputs: rawData,
      };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
    // throw err
  }
}