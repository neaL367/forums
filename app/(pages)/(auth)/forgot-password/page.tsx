"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import type { z } from "zod"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { ForgotPasswordSchema } from "@/lib/definitions"
import { authClient } from "@/app/lib/auth-client"

type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const onSubmit = async ({ email }: ForgotPasswordInput) => {
    setLoading(true)

    try {
      // Call the server action directly
      const callbackUrl = `${window.location.origin}/reset-password`
      await authClient.forgetPassword({email, redirectTo: callbackUrl})

      // Always show success to prevent email enumeration
      setEmailSent(true)
      toast.success("If an account exists with that email, we've sent a password reset link")
    } catch {
      // Don't reveal if the email exists or not for security
      setEmailSent(true)
      toast.success("If an account exists with that email, we've sent a password reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="w-full max-w-md p-8 space-y-6 ">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link</p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-yellow-500 hover:from-yellow-600 text-black font-medium rounded-md transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Check Your Email</h3>
              <p className="text-muted-foreground">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <p className="text-sm text-white">Please check your email inbox and spam folder.</p>
            </div>
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full h-11 bg-yellow-500 hover:from-yellow-600 text-black font-medium rounded-md transition-all duration-200"
            >
              Return to Sign In
            </Button>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/sign-in"
            className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
