import { FormState } from "@/types/formstate";

export type UpdateForumFormData = {
  title?: string
  description?: string
  parentForumId?: string
};

export type UpdateForumFormState = FormState<UpdateForumFormData>
