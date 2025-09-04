"use server"

import { headers } from "next/headers";
import { auth } from "@lib/auth";

export async function impersonateMemberAction(memberId: string) {
  try {
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
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}

export async function stopImpersonationAction() {
  try {
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
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}