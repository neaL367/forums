"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { SetPasswordSchema } from "@/zod/administrator/member/set-password";
import type {
  SetPasswordFormData,
  SetPasswordFormState,
} from "@/formdata/administrator/member/set-password";

export async function setPasswordFormAction(
  prevState: SetPasswordFormState,
  formData: FormData,
): Promise<SetPasswordFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: SetPasswordFormData = {
      memberId: formData.get("memberId") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = SetPasswordSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.setUserPassword({
      body: {
        userId: validated.data.memberId,
        newPassword: validated.data.newPassword,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Member password updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof APIError
          ? error.body?.message || error.message
          : "An unexpected error occurred.",
    };
  }
}
