export type FormState<T> = {
  errors?: {
    [K in keyof T]?: string[]
  }
  inputs?: Partial<T>
  message?: string
  success?: boolean
  resetKey?: string
}
