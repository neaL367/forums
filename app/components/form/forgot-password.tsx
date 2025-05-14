"use client"

import { useActionState } from "react"
import { startTransition, useEffect, useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { forgotPasswordAction, type ForgotPwdState } from "@/actions/forgot-password"

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<ForgotPwdState, FormData>(forgotPasswordAction, {})
  const [redirectTo, setRedirectTo] = useState("")

  useEffect(() => {
    setRedirectTo(`${window.location.origin}/reset-password`)
  }, [])


  if (state.message) {
    return <p className="text-green-600">{state.message}</p>
  }

  return (
    <form action={(formData: FormData) => startTransition(() => formAction(formData))} className="space-y-4">
      {/* pass the redirectTo into the action */}
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Input name="email" type="email" placeholder="Your email address" required />

      {state.error && <p className="text-red-500">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send Reset Link"}
      </Button>
    </form>
  )
}
