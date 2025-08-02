export type VerificationEmailFormData = {
  email: string
}
export type VerificationEmailFormState = {
  errors?: {
    [K in keyof VerificationEmailFormData]?: string[]
  }
  inputs?: Partial<VerificationEmailFormData>
  message?: string
  success?: boolean
}