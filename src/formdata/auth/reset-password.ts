import { FormState } from "@/formdata/formstate";

export type ResetPasswordFormData = {
  password: string
  passwordConfirmation: string
  token: string
}

export type ResetPasswordFormState = FormState<ResetPasswordFormData>
