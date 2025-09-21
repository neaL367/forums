export type SignUpFormData = {
  username: string
  email: string
  password: string
  passwordConfirmation: string

}

export type SignUpFormState = {
  errors?: {
    [K in keyof SignUpFormData]?: string[]
  }
  inputs?: Partial<SignUpFormData>
  message?: string
  success?: boolean
}
