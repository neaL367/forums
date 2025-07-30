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

export type ForgotUsernameFormData = {
  email: string
}

export type ForgotPasswordFormData = {
  email: string
}

export type VerificationEmailFormData = {
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

export type ResetPasswordFormState = {
  errors?: {
    [K in keyof ResetPasswordFormData]?: string[]
  }
  inputs?: Partial<ResetPasswordFormData>
  message?: string
  success?: boolean
}

export type ForgotUsernameFormState = {
  errors?: {
    [K in keyof ForgotUsernameFormData]?: string[]
  }
  inputs?: Partial<ForgotUsernameFormData>
  message?: string
  success?: boolean
}

export type ForgotPasswordFormState = {
  errors?: {
    [K in keyof ForgotPasswordFormData]?: string[]
  }
  inputs?: Partial<ForgotPasswordFormData>
  message?: string
  success?: boolean
}

export type VerificationEmailFormState = {
  errors?: {
    [K in keyof VerificationEmailFormData]?: string[]
  }
  inputs?: Partial<VerificationEmailFormData>
  message?: string
  success?: boolean
}
