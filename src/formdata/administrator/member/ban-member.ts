import { FormState } from "@/types/formstate";

export type BanMemberFormData = {
  memberId: string;
  banReason?: string;
  banExpiresIn?: string;
};

export type BanMemberFormState = FormState<BanMemberFormData>;
