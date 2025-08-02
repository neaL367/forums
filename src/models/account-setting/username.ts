export type UsernameFormData = {
  displayUsername: string
}

export type UsernameFormState = {
  success?: boolean
  message?: string
  errors?: {
     [K in keyof UsernameFormData]?: string[]
  }
  inputs?: Partial<UsernameFormData>
}
