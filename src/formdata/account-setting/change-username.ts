import { FormState } from "@/types/formstate";

export type ChangeUsernameFormData = {
  username: string
  displayUsername: string
}

export type ChangeUsernameFormState = FormState<ChangeUsernameFormData>
