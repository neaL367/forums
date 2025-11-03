import { FormState } from "@/types/formstate";

export type RevokeSessionFormData = {
  sessionToken: string;
};

export type RevokeSessionFormState = FormState<RevokeSessionFormData>;
