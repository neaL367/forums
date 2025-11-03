import { FormState } from "@/types/formstate";

export type EditMemberFormData = {
  memberId: string;
  username: string;
  displayUsername: string;
  image?: string;
};

export type EditMemberFormState = FormState<EditMemberFormData>;
