export type AddForumFormData = {
  title: string
  description?: string
  parentForumId?: string
};

export type AddForumFormState = {
  errors?: {
    [K in keyof AddForumFormData]?: string[]
  };
  inputs?: Partial<AddForumFormData>;
  message?: string;
  success?: boolean;
};
