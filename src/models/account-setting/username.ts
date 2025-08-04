export type ChangeUsernameFormData = {
  displayUsername: string
}

export type ChangeUsernameFormState = {
  success?: boolean
  message?: string
  errors?: {
     [K in keyof ChangeUsernameFormData]?: string[]
  }
  inputs?: Partial<ChangeUsernameFormData>
}
