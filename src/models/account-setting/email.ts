export type ChangeEmailFormData = {
  newEmail: string
}

export type ChangeEmailFormState = {
  success?: boolean
  message?: string
  errors?: {
     [K in keyof ChangeEmailFormData]?: string[]
  }
  inputs?: Partial<ChangeEmailFormData>
}
