export type ForgotUsernameFormData = {
  email: string
}

export type ForgotUsernameFormState = {
  errors?: {
    [K in keyof ForgotUsernameFormData]?: string[]
  }
  inputs?: Partial<ForgotUsernameFormData>
  message?: string
  success?: boolean
}