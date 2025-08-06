export type UpdateProfileFormData = {
    image?: string
    bio?: string
    location?: string
    website?: string
}

export type UpdateProfileFormState = {
    success?: boolean
    message?: string
    errors?: {
        [K in keyof UpdateProfileFormData]?: string[]
    }
    inputs?: UpdateProfileFormData
    resetKey?: string
}