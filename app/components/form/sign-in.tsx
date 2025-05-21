"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2, AtSign, Lock, LogIn } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import type { z } from "zod"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"

import { SigninFormSchema } from "@/lib/definitions"

// Infer the form input types from the Zod schemas
type SigninFormInput = z.infer<typeof SigninFormSchema>

export function SignInForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormInput>({
    resolver: zodResolver(SigninFormSchema),
    mode: "onBlur",
    defaultValues: { identifier: "", password: "" },
  })

  const onSubmit = async ({ identifier, password }: SigninFormInput) => {
    setLoading(true)
    try {
      let error
      if (identifier.includes("@")) {
        // Sign in with email
        ;({ error } = await authClient.signIn.email({
          email: identifier,
          password,
        }))
      } else {
        // Sign in with username
        ;({ error } = await authClient.signIn.username({
          username: identifier,
          password,
        }))
      }

      if (error) {
        toast.error(error.message || "Sign in failed")
      } else {
        toast.success("Signed in successfully!")
        router.push("/")
        router.refresh()
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-6 ">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Identifier */}
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-sm font-medium">
            Username or Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <AtSign size={18} />
            </div>
            <Input
              id="identifier"
              className={`pl-10 ${errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="username or email"
              {...register("identifier")}
              aria-invalid={errors.identifier ? "true" : "false"}
            />
          </div>
          {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
        </div>

        {/* Password */}
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <div className="flex justify-between text-sm pt-2">
        <Link href="/forgot-username" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
          Forgot Username?
        </Link>
        <Link href="/forgot-password" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
          Forgot Password?
        </Link>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
