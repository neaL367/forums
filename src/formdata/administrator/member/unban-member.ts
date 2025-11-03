import { FormState } from "@/types/formstate";

export type UnbanMemberFormData = {
  memberId: string;
};

export type UnbanMemberFormState = FormState<UnbanMemberFormData>;
