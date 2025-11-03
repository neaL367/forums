"use server";

import { APIError } from "better-auth/api";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import type { Roles } from "@/types/member";

export async function setMemberRoleAction(
  memberId: string,
  role: Roles,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    await auth.api.setRole({
      body: { userId: memberId, role: role },
      headers: await headers(),
    });

    updateTag("profile");
    updateTag("admin-members");

    return {
      success: true,
      message: `Member role set to ${role} successfully.`,
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
