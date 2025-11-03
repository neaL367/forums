"use server";

import { APIError } from "better-auth/api";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { authServer } from "@/lib/auth-server";
import { EditMemberSchema } from "@/zod/administrator/member/edit-member";
import type {
  EditMemberFormData,
  EditMemberFormState,
} from "@/formdata/administrator/member/edit-member";

export async function editMemberFormAction(
  prevState: EditMemberFormState,
  formData: FormData,
): Promise<EditMemberFormState> {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    const rawData: EditMemberFormData = {
      memberId: formData.get("memberId") as string,
      username: formData.get("username") as string,
      displayUsername: formData.get("displayUsername") as string,
      image: formData.get("image") as string | undefined,
    };

    if (rawData.image === "") rawData.image = undefined;

    const validated = EditMemberSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
        message: "Please fix the errors below.",
        success: false,
      };
    }

    await auth.api.updateUser({
      body: {
        username: validated.data.username,
        displayUsername: validated.data.displayUsername,
        image: validated.data.image,
      },
      headers: await headers(),
    });

    updateTag("profile");
    updateTag("admin-members");

    return {
      success: true,
      message: "Member updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof APIError
          ? error.body?.message || error.message
          : "An unexpected error occurred.",
      inputs: {
        memberId: formData.get("memberId") as string,
        username: formData.get("username") as string,
        displayUsername: formData.get("displayUsername") as string,
        image: formData.get("image") as string | undefined,
      },
    };
  }
}
