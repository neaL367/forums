"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

import { resetPasswordAction, type ResetState } from "@/actions/reset-password"

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, action, isPending] = useActionState<ResetState, FormData>(resetPasswordAction, {})
  const router = useRouter()

  useEffect(() => {
    if (state.message) {
      const t = setTimeout(() => router.push("/sign-in"), 2000)
      return () => clearTimeout(t)
    }
  }, [state.message, router])

  if (state.message) {
    return <p className="text-green-600">{state.message}</p>
  }

  return (
    <form
      action={async (formData: FormData) => {
        formData.append("token", token)
        action(formData)
      }}
      className="space-y-4"
    >
      <Input name="password" type="password" placeholder="New password" required minLength={8} maxLength={20} />

      {state.error && <p className="text-red-500">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Setting…" : "Set New Password"}
      </Button>
    </form>
  )
}
