'use server'

import { searchUsername } from "@/actions/search-username"

export type RecoverState = {
    message?: string
    error?: string
}

export async function recoverUsername(
    prev: RecoverState,
    formData: FormData
): Promise<RecoverState> {
    const email = String(formData.get('email') ?? '')

    if (!email) {
        return { error: 'Email is required.' }
    }

    const username = await searchUsername(email)

    if (!username) {
        return { error: 'No account found with that email.' }
    }

    // send the email here
    return { message: `Sent username to ${email}` }
}
