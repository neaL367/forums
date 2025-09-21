export type AddCategoriesFormData = {
  title: string;
  description?: string;
};

export type AddCategoriesFormState = {
  errors?: {
    [K in keyof AddCategoriesFormData]?: string[]
  };
  inputs?: Partial<AddCategoriesFormData>;
  message?: string;
  success?: boolean;
};
