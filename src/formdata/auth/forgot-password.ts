import { FormState } from "@/types/formstate";

export type ForgotPasswordFormData = {
  email: string
}

export type ForgotPasswordFormState = FormState<ForgotPasswordFormData>
