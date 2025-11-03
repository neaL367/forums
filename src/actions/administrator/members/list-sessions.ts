"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";

export async function listUserSessionsAction(memberId: string) {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
        sessions: undefined,
      };
    }

    const data = await auth.api.listUserSessions({
      body: { userId: memberId },
      headers: await headers(),
    });

    return {
      success: true,
      sessions: data.sessions,
      message: "Sessions retrieved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof APIError
          ? error.body?.message || error.message
          : "An unexpected error occurred.",
      sessions: undefined,
    };
  }
}
