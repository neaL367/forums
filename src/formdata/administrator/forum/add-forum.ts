import { FormState } from "@/types/formstate";

export type AddForumFormData = {
  title: string
  description?: string
  parentForumId?: string
};

export type AddForumFormState = FormState<AddForumFormData>
