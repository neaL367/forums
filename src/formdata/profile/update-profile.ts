import { FormState } from "@/types/formstate";

export type UpdateProfileFormData = {
    image?: string
    bio?: string
    location?: string
    website?: string
}

export type UpdateProfileFormState = FormState<UpdateProfileFormData>
