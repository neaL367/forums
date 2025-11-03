"use server";

import { APIError } from "better-auth/api";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { BanMemberSchema } from "@/zod/administrator/member/ban-member";
import type {
  BanMemberFormData,
  BanMemberFormState,
} from "@/formdata/administrator/member/ban-member";

export async function banMemberFormAction(
  prevState: BanMemberFormState,
  formData: FormData,
): Promise<BanMemberFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: BanMemberFormData = {
      memberId: formData.get("memberId") as string,
      banReason: formData.get("banReason") as string | undefined,
      banExpiresIn: formData.get("banExpiresIn") as string | undefined,
    };

    const validated = BanMemberSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.banUser({
      body: {
        userId: validated.data.memberId,
        banReason: validated.data.banReason,
        banExpiresIn: validated.data.banExpiresIn,
      },
      headers: await headers(),
    });

    updateTag("admin-members");

    return {
      success: true,
      message: "Member banned successfully.",
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
