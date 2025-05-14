"use client"

import { useSession, signOut } from "@/lib/auth-client"
import { RecoverUsernameForm } from "@/components/form/recover-username"
import { Button } from "@/ui/button"

export default function ForgotUsernamePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div className="p-4">Loading...</div>
  }

  if (session) {
    return (
      <div className="p-4">
        <p className="text-red-500 mb-4">
          You are logged in, please sign out to recover your username.
        </p>
        <Button
          onClick={() => signOut()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Forgot Username</h1>
      <RecoverUsernameForm />
    </div>
  )
}
