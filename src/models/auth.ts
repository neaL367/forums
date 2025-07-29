export type SignUpFormData = {
  username: string
  email: string
  password: string
  passwordConfirmation: string

}

export type SignInFormData = {
  username: string
  password: string
}

export type ForgotUsernameOrPasswordFormData = {
  email: string
}

export type ResetPasswordFormData = {
  password: string
  passwordConfirmation: string
  token: string
}

export type SignUpFormState = {
  errors?: {
    [K in keyof SignUpFormData]?: string[]
  }
  inputs?: Partial<SignUpFormData>
  message?: string
  success?: boolean
}

export type SignInFormState = {
  errors?: {
    [K in keyof SignInFormData]?: string[]
  }
  inputs?: Partial<SignInFormData>
  message?: string
  success?: boolean
}

export type ForgotUsernameOrPasswordFormState = {
  errors?: {
    [K in keyof ForgotUsernameOrPasswordFormData]?: string[]
  }
  inputs?: Partial<ForgotUsernameOrPasswordFormData>
  message?: string
  success?: boolean
}

export type ResetPasswordFormState = {
  errors?: {
    [K in keyof ResetPasswordFormData]?: string[]
  }
  inputs?: Partial<ResetPasswordFormData>
  message?: string
  success?: boolean
}