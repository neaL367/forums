"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2, User, Mail, Lock, KeyRound, ArrowRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import type { z } from "zod"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"

import { SignupFormSchema } from "@/lib/definitions"

// Infer the form input types from the Zod schemas
type SignupFormInput = z.infer<typeof SignupFormSchema>

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(SignupFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async ({ username, email, password }: SignupFormInput) => {
    setLoading(true)

    try {
      const { error: signUpError } = await authClient.signUp.email(
        {
          email,
          password,
          name: username,
          username: username,
          callbackURL: "/",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            toast.success("Account created! Please verify your email.")
            router.push(`/verify-email?email=${encodeURIComponent(email)}`)
          },
          onError: (ctx) => {
            const message = ctx.error.message || "Sign up failed"
            toast.error(message)
          },
        },
      )

      if (signUpError) {
        toast.error(signUpError.message || "Sign up failed")
      }
    } catch {
      const message = "An unexpected error occurred"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-8 ">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign Up</h2>
        <p className="text-sm text-muted-foreground">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/** Username Field **/}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <Input
              id="username"
              className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="johndoe"
              {...register("username")}
              aria-invalid={errors.username ? "true" : "false"}
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {/** Email Field **/}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
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

        {/** Password Field **/}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              type="password"
              className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="••••••••"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/** Confirm Password Field **/}
        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <KeyRound size={18} />
            </div>
            <Input
              id="confirm_password"
              type="password"
              className={`pl-10 ${errors.confirm_password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="••••••••"
              {...register("confirm_password")}
              aria-invalid={errors.confirm_password ? "true" : "false"}
            />
          </div>
          {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
