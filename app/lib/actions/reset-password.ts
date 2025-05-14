'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export type ResetState = {
    message?: string
    error?: string
}

export async function resetPasswordAction(
    prev: ResetState,
    formData: FormData
): Promise<ResetState> {
    const token = String(formData.get('token') ?? '')
    const newPassword = String(formData.get('password') ?? '')

    if (!token) {
        return { error: 'Invalid or missing token.' }
    }

    const result = await auth.api.resetPassword({
        body: { token, newPassword },
        headers: await headers(),
    })

    if ('error' in result && result.error) {
        return { error: (result.error as { message?: string }).message ?? 'Failed to reset password.' }
    }

    return { message: 'Your password has been reset!' }
}
