"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { RevokeSessionSchema } from "@/zod/administrator/member/revoke-session";
import type {
  RevokeSessionFormData,
  RevokeSessionFormState,
} from "@/formdata/administrator/member/revoke-session";

export async function revokeSessionFormAction(
  prevState: RevokeSessionFormState,
  formData: FormData,
): Promise<RevokeSessionFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: RevokeSessionFormData = {
      sessionToken: formData.get("sessionToken") as string,
    };

    const validated = RevokeSessionSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.revokeUserSession({
      body: { sessionToken: validated.data.sessionToken },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Session revoked successfully.",
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
