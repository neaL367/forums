"use server"

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"
import { getServerSession } from "@/lib/dal";

export async function revokeMemberSessionAction(sessionToken: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to add categories.",
      };
    }

    await auth.api.revokeUserSession({
      body: { sessionToken: sessionToken },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Member revoked successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function revokeAllSessionsMemberAction(memberId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator to add categories.",
      };
    }

    await auth.api.revokeUserSessions({
      body: { userId: memberId },
      headers: await headers(),
    });

    return {
      success: true,
      message: "All sessions for the member have been revoked successfully.",
    };


  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function listUserSessionsAction(memberId: string) {
  try {
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
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}
