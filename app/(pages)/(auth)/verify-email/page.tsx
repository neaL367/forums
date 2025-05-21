"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/ui/button"
import { resendVerificationEmail, verifyEmail } from "@/actions/verify-email"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/ui/input"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email") || ""
  const [verifying, setVerifying] = useState(!!token)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState(email)
  const [resending, setResending] = useState(false)
  const [lastResendTime, setLastResendTime] = useState<number | null>(null)

  useEffect(() => {
    if (!token) {
      // No token means we're just showing the "check your email" page
      setVerifying(false)
      return
    }

    const performVerification = async () => {
      try {
        // Call the server action directly
        const result = await verifyEmail(token)

        if (!result.success) {
          setError(result.error || "Verification failed")
          toast.error(result.error || "Verification failed")
        } else {
          setVerified(true)
          toast.success("Email verified successfully!")
        }
      } catch {
        setError("An unexpected error occurred during verification")
        toast.error("An unexpected error occurred during verification")
      } finally {
        setVerifying(false)
      }
    }

    performVerification()
  }, [token, router])

  const handleResendEmail = async () => {
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    // rate limiting - only allow resend every 60 seconds
    const now = Date.now()
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingSeconds = Math.ceil((60000 - (now - lastResendTime)) / 1000)
      toast.error(`Please wait ${remainingSeconds} seconds before requesting another email`)
      return
    }

    setResending(true)
    try {
      const result = await resendVerificationEmail(emailInput)
      if (result.success) {
        setLastResendTime(now)
        toast.success("Verification email resent. Please check your inbox.")
      } else {
        toast.error(result.error || "Failed to resend verification email")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setResending(false)
    }
  }

  // Show check email message when no token is provided
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Mail className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="mt-4 text-gray-600">
              We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify
              your account.
            </p>
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-500">
                If you don&apos;t see the email, check your spam folder or try resending the verification email.
              </p>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full"
                />
                <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={resending}>
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </div>

              <Button variant="ghost" className="w-full" onClick={() => router.push("/sign-in")}>
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Email Verification</h1>

          {verifying && (
            <div className="mt-4 text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
              </div>
              <p className="mt-2 text-gray-600">Verifying your email...</p>
            </div>
          )}

          {!verifying && error && (
            <div className="mt-4">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-red-500">{error}</p>
              <p className="mt-2 text-gray-600">The verification link may have expired or is invalid.</p>
              <div className="mt-6 space-y-4">
                <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={resending}>
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/sign-in")}>
                  Return to Sign In
                </Button>
              </div>
            </div>
          )}

          {!verifying && verified && (
            <div className="mt-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-green-500 font-medium text-lg">Your email has been verified successfully!</p>
              <p className="mt-2 text-gray-600">You can now access all features of your account.</p>
              <Button onClick={() => router.push("/")} className="mt-6 w-full">
                Go to Homepage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
