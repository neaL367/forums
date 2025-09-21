export type ForgotPasswordFormData = {
  email: string
}

export type ForgotPasswordFormState = {
  errors?: {
    [K in keyof ForgotPasswordFormData]?: string[]
  }
  inputs?: Partial<ForgotPasswordFormData>
  message?: string
  success?: boolean
}