import { FormState } from "@/formdata/formstate";

export type SignUpFormData = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export type SignUpFormState = FormState<SignUpFormData>
