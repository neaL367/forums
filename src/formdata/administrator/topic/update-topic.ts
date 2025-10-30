import { FormState } from "@/formdata/formstate";

export type UpdateTopicFormData = {
  title?: string;
  forumId?: string;
};

export type UpdateTopicFormState = FormState<UpdateTopicFormData>;
