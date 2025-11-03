"use server";

import { APIError } from "better-auth/api";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { UnbanMemberSchema } from "@/zod/administrator/member/unban-member";
import type {
  UnbanMemberFormData,
  UnbanMemberFormState,
} from "@/formdata/administrator/member/unban-member";

export async function unbanMemberFormAction(
  prevState: UnbanMemberFormState,
  formData: FormData,
): Promise<UnbanMemberFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: UnbanMemberFormData = {
      memberId: formData.get("memberId") as string,
    };

    const validated = UnbanMemberSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.unbanUser({
      body: { userId: validated.data.memberId },
      headers: await headers(),
    });

    updateTag("members");
    updateTag("admin-members");

    return {
      success: true,
      message: "Member unbanned successfully.",
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
