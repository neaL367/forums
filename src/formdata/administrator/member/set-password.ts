import { FormState } from "@/types/formstate";

export type SetPasswordFormData = {
  memberId: string;
  newPassword: string;
  confirmPassword: string;
};

export type SetPasswordFormState = FormState<SetPasswordFormData>;
