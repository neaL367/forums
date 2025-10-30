import { FormState } from "@/types/formstate";

export type AddTopicFormData = {
  title: string;
  forumId: string;
};

export type AddTopicFormState = FormState<AddTopicFormData>;
