"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { ImpersonateMemberSchema } from "@/zod/administrator/member/impersonate-member";
import type {
  ImpersonateMemberFormData,
  ImpersonateMemberFormState,
} from "@/formdata/administrator/member/impersonate-member";

export async function impersonateMemberFormAction(
  prevState: ImpersonateMemberFormState,
  formData: FormData,
): Promise<ImpersonateMemberFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: ImpersonateMemberFormData = {
      memberId: formData.get("memberId") as string,
    };

    const validated = ImpersonateMemberSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.impersonateUser({
      body: { userId: validated.data.memberId },
      headers: await headers(),
    });

    return {
      success: true,
      message: "You are now impersonating the user.",
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

export async function stopImpersonationAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    await auth.api.stopImpersonating({
      headers: await headers(),
    });

    return {
      success: true,
      message: "You have stopped impersonating the user.",
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