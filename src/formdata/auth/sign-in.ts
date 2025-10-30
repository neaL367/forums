import { FormState } from "@/types/formstate";

export type SignInFormData = {
  username: string
  password: string
}

export type SignInFormState = FormState<SignInFormData>
