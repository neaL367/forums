"use server"

import { APIError } from "better-auth/api"
import { revalidateTag } from "next/cache"
import { getUserProfileById, updateUserProfile } from "@/database/user"
import { verifySession } from "@/lib/dal"
import { UpdateProfileFormData, UpdateProfileFormState } from "@/models/profile/update-profile"
import { UpdateProfileSchema } from "@/schemas/profile/update-profile"

export async function updateProfileAction(
  prevState: UpdateProfileFormState,
  formData: FormData,
): Promise<UpdateProfileFormState> {
  const rawData: UpdateProfileFormData = {
    image: formData.get("image") as string || undefined,
    bio: formData.get("bio") as string || undefined,
    location: formData.get("location") as string || undefined,
    website: formData.get("website") as string || undefined,
  }

  if (rawData.image === "") rawData.image = undefined
  if (rawData.bio === "") rawData.bio = undefined
  if (rawData.location === "") rawData.location = undefined
  if (rawData.website === "") rawData.website = undefined

  const validated = UpdateProfileSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      inputs: rawData,
    }
  }

  const { image, bio, location, website } = validated.data

  try {
    const session = await verifySession()

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized: Please log in to update your profile.",
        inputs: rawData,
      }
    }

    const user = await getUserProfileById(session.user.id)

    if (!user || session.user.id !== user.id) {
      return {
        success: false,
        message: "Unauthorized: You can only update your own profile.",
        inputs: rawData,
      }
    }

    await updateUserProfile(session.user.id, { image: image, bio: bio, location: location, website: website })

    revalidateTag("profile")

    return {
      success: true,
      message: "Profile updated successfully!",
      inputs: {},
      resetKey: Date.now().toString(),
    }
  } catch (err) {
    console.error("Error updating profile:", err)

    if (err instanceof APIError) {
      return {
        success: false,
        message: err.body?.message ?? err.message ?? "An error occurred while updating profile.",
        inputs: rawData,
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
  }
}
