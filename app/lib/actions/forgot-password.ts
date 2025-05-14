'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'   

export type ForgotPwdState = {
  message?: string
  error?: string
}

export async function forgotPasswordAction(
  prev: ForgotPwdState,
  formData: FormData
): Promise<ForgotPwdState> {
  const email = String(formData.get('email') ?? '')
  const redirectTo = String(formData.get('redirectTo') ?? '')

  if (!email) {
    return { error: 'Email is required.' }
  }

  const result = await auth.api.forgetPassword({
    body: { email, redirectTo },
    headers: await headers(),
  })

  if ('error' in result && result.error) {
    return { error: (result.error as { message?: string }).message ?? 'Failed to send reset link.' }
  }

  return { message: 'If that email is registered, you’ll get a reset link shortly.' }
}
