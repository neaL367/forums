import { FormState } from "@/types/formstate";

export type RevokeAllSessionsFormData = {
  memberId: string;
};

export type RevokeAllSessionsFormState = FormState<RevokeAllSessionsFormData>;
