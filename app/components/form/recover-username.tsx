"use client"

import { useActionState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { recoverUsername, type RecoverState } from "@/actions/recover-username"

export function RecoverUsernameForm() {
  const [state, action, isPending] = useActionState<RecoverState, FormData>(recoverUsername, {})

  if (state.message) {
    return <p className="text-green-600">{state.message}</p>
  }

  return (
    <form action={action} className="space-y-4">
      <Input name="email" type="email" placeholder="Your email address" required />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send Username"}
      </Button>
    </form>
  )
}
