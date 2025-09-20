"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/dal";
import { addCategories } from "@/database/categories";
import { AddCategoriesSchema } from "@/zod/administrator/categories/add-categories";
import { AddCategoriesFormData, AddCategoriesFormState } from "@/models/administrator/categories/add-categories";

export async function addCategoriesAction(
  prevState: AddCategoriesFormState,
  formData: FormData
): Promise<AddCategoriesFormState> {
  const rawData: AddCategoriesFormData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };

  const validated = AddCategoriesSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    };
  }

  const { title, description } = validated.data;

  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized: Please log in to add categories.",
        inputs: rawData,
      };
    }

    const category = await addCategories({
      title,
      description,
    });

    revalidateTag("admin-mgt-categories");

    return {
      success: true,
      message: `Category "${category.title}" added successfully!`,
      inputs: {},
    };
  } catch (err) {
    console.error("Error adding category:", err);

    if (err instanceof Error) {
      return {
        success: false,
        message:
          err.message ??
          "An error occurred while adding category.",
        inputs: rawData,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    };
  }
}
