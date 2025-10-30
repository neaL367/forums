"use server";

import { revalidateTag } from "next/cache";
import { authServer } from "@/lib/auth-server";
import { deleteForum } from "@/database/forums";

export async function deleteForumAction(forumId: string) {
  try {
    const session = await authServer();

    if (!session?.user?.id || session?.user.role !== "ADMINISTRATOR") {
      return {
        success: false,
        message: "Access denied: You must be an administrator.",
      };
    }

    await deleteForum(forumId);

    revalidateTag("admin-mgt-forums");

    return {
      message: "Forum deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error deleted forum:", error);
    return {
      message: "Failed to delete forum",
      success: false,
    };
  }
}
