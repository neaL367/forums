"use server";

import { APIError } from "better-auth/api";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { RemoveMemberSchema } from "@/zod/administrator/member/remove-member";
import type {
  RemoveMemberFormData,
  RemoveMemberFormState,
} from "@/formdata/administrator/member/remove-member";

export async function removeMemberFormAction(
  prevState: RemoveMemberFormState,
  formData: FormData,
): Promise<RemoveMemberFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: RemoveMemberFormData = {
      memberId: formData.get("memberId") as string,
    };

    const validated = RemoveMemberSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.removeUser({
      body: { userId: validated.data.memberId },
      headers: await headers(),
    });

    updateTag("members");
    updateTag("admin-members");

    return {
      success: true,
      message: "Member removed successfully.",
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
