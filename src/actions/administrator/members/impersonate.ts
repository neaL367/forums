"use server"

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@lib/auth";
import { getServerSession } from "@/lib/dal";

export async function impersonateMemberAction(memberId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to add categories.",
      };
    }

    await auth.api.impersonateUser({
      body: { userId: memberId },
      headers: await headers(),
    });

    return {
      success: true,
      message: "You are now impersonating the user.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function stopImpersonationAction() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to add categories.",
      };
    }

    await auth.api.stopImpersonating({
      headers: await headers()
    });

    return {
      success: true,
      message: "You have stopped impersonating the user.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}