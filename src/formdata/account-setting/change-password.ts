import { FormState } from "@/types/formstate";

export type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export type  ChangePasswordFormState = FormState< ChangePasswordFormData>
