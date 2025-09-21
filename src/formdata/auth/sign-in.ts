export type SignInFormData = {
  username: string
  password: string
}


export type SignInFormState = {
  errors?: {
    [K in keyof SignInFormData]?: string[]
  }
  inputs?: Partial<SignInFormData>
  message?: string
  success?: boolean
}