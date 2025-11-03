import { FormState } from "@/types/formstate";

export type RemoveMemberFormData = {
  memberId: string;
};

export type RemoveMemberFormState = FormState<RemoveMemberFormData>;
