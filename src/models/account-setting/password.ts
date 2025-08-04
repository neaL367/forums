export type ChangePasswordFormData = {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string

}

export type ChangePasswordFormState = {
  success?: boolean
  message?: string
  errors?: {
     [K in keyof ChangePasswordFormData]?: string[]
  }
  inputs?: Partial<ChangePasswordFormData>
}
