"use server";

import { APIError } from "better-auth/api";
import { neon } from "@neondatabase/serverless";
import { ForgotUsernameFormData, ForgotUsernameFormState } from "@/models/auth";
import { forgotUsernameSchema } from "@/lib/definitions";
import { sendUsernameReminderEmail } from '@/lib/email';

export async function forgotUsernameAction(prevState: ForgotUsernameFormState, formData: FormData): Promise<ForgotUsernameFormState> {

  const rawData: ForgotUsernameFormData = {
    email: formData.get("email") as string,
  }

  const validated = forgotUsernameSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    };
  }

  const { email } = validated.data
  const sql = neon(process.env.DATABASE_URL!)

  try {
    const users = await sql`
      SELECT id, email, username, name 
      FROM "user" 
      WHERE email = ${email}
      LIMIT 1
    `    

    if (users.length === 0) {
      return {
        success: true,
        message: "If an account with that email exists, we've sent you an email with further instructions.",
        inputs: {},
      }
    }

    const user = users[0]

    await sendUsernameReminderEmail(user.email, user.username, user.name)

    return {
      success: true,
      message: "If an account with that email exists, we've sent you an email with your username.",
      inputs: {},
    }
  } catch (err) {
    if (err instanceof APIError) {

      return {
        message: err.body?.message ?? err.message ?? "An error occurred during the request.",
        inputs: rawData,
      };
    }
    throw err
  }
}