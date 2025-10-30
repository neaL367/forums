import { FormState } from "@/types/formstate";

export type UpdateTopicFormData = {
  title?: string;
  forumId?: string;
};

export type UpdateTopicFormState = FormState<UpdateTopicFormData>;
