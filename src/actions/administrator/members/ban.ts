"use server"

import { APIError } from "better-auth/api"
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"
import { getServerSession } from "@/lib/dal";

export async function banMemberAction(memberId: string, banReason?: string, banExpiresIn?: number) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    await auth.api.banUser({
      body: { userId: memberId, banReason: banReason, banExpiresIn: banExpiresIn },
      headers: await headers(),
    });

    revalidateTag("members")


    return {
      success: true,
      message: "Member banned successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}

export async function unbanMemberAction(memberId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }
    
    await auth.api.unbanUser({
      body: { userId: memberId },
      headers: await headers(),
    });

    revalidateTag("members")


    return {
      success: true,
      message: "Member unbanned successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof APIError ? error.body?.message || error.message : "An unexpected error occurred.",
    };
  }
}