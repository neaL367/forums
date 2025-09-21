
export type ResetPasswordFormData = {
  password: string
  passwordConfirmation: string
  token: string
}


export type ResetPasswordFormState = {
  errors?: {
    [K in keyof ResetPasswordFormData]?: string[]
  }
  inputs?: Partial<ResetPasswordFormData>
  message?: string
  success?: boolean
}