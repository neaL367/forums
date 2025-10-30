import { FormState } from "@/formdata/formstate";

export type AddTopicFormData = {
  title: string;
  forumId: string;
};

export type AddTopicFormState = FormState<AddTopicFormData>;
