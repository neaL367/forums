import { FormState } from "@/formdata/formstate";

export type ForgotPasswordFormData = {
  email: string
}

export type ForgotPasswordFormState = FormState<ForgotPasswordFormData>
