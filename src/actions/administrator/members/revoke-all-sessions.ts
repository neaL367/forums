"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { RevokeAllSessionsSchema } from "@/zod/administrator/member/revoke-all-sessions";
import type {
  RevokeAllSessionsFormData,
  RevokeAllSessionsFormState,
} from "@/formdata/administrator/member/revoke-all-sessions";

export async function revokeAllSessionsFormAction(
  prevState: RevokeAllSessionsFormState,
  formData: FormData,
): Promise<RevokeAllSessionsFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: RevokeAllSessionsFormData = {
      memberId: formData.get("memberId") as string,
    };

    const validated = RevokeAllSessionsSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.revokeUserSessions({
      body: { userId: validated.data.memberId },
      headers: await headers(),
    });

    return {
      success: true,
      message: "All sessions for the member have been revoked successfully.",
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
