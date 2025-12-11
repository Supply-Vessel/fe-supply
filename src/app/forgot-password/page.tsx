"use client"

import { ArrowLeft, CheckCircle, AlertCircle, EyeOffIcon, EyeIcon } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { apiClient } from "@/src/lib/apiClient"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { z } from "zod"

// Функция проверки силы пароля
const calculatePasswordStrength = (password: string): number => {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}

// Zod схема для формы запроса сброса пароля (email)
const emailFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
})

// Zod схема для формы сброса пароля
const resetPasswordFormSchema = z.object({
  confirmationCode: z
    .string()
    .length(6, "Confirmation code must be exactly 6 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => calculatePasswordStrength(password) >= 3,
      "Password is too weak. Include uppercase, lowercase, numbers, and special characters"
    ),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type EmailFormSchema = z.infer<typeof emailFormSchema>
type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const router = useRouter()

  // Форма для запроса сброса пароля
  const emailForm = useForm<EmailFormSchema>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  // Форма для сброса пароля
  const resetForm = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      confirmationCode: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = resetForm.watch("password")
  const confirmPassword = resetForm.watch("confirmPassword")
  const passwordStrength = calculatePasswordStrength(password || "")

  const getPasswordStrengthColor = useCallback((strength: number) => {
    if (strength <= 2) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }, [])

  const getPasswordStrengthText = useCallback((strength: number) => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }, [])

  const handleEmailSubmit = async (data: EmailFormSchema) => {
    try {
      const response = await apiClient.post("/api/auth/create-reset-code", { email: data.email })
      toast(response.success ? "Success!" : "Error!", {
        description: response?.message
      })
      if (response?.success) {
        setSubmittedEmail(data.email)
        setIsSubmitted(true)
      }
    } catch (err) {
      emailForm.setError("email", { 
        type: "manual", 
        message: "Failed to send reset email. Please try again." 
      })
    }
  }

  const handleResendEmail = async () => {
    if (!submittedEmail) return
    
    try {
      const response = await apiClient.post("/api/auth/create-reset-code", { email: submittedEmail })
      toast(response.success ? "Email resent!" : "Error!", {
        description: response?.message
      })
    } catch (err) {
      toast("Error!", {
        description: "Failed to resend email. Please try again."
      })
    }
  }

  const handleResetPassword = async (data: ResetPasswordFormSchema) => {
    try {
      const submitData = {
        code: data.confirmationCode,
        password: data.password,
        email: submittedEmail
      }
      const response = await apiClient.post("/api/auth/reset-password", submitData)
      toast(response.success ? "Success!" : "Error!", {
        description: response?.message
      })
      if (response?.success) {
        router.push("/signin")
      }
    } catch (err) {
      resetForm.setError("confirmationCode", { 
        type: "manual", 
        message: "Failed to reset password. Please try again." 
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Check your email</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent password reset instructions to your email
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-700">We've sent a password reset confirmation code to:</p>
              <p className="font-medium text-gray-900">{submittedEmail}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Check your email</p>
                <p>Enter the 6-digit confirmation code provided to your email to reset your password. If you don't see it, check your spam folder.</p>
              </div>
            </div>

            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
              {/* Confirmation Code */}
              <div className="space-y-2">
                <Label htmlFor="confirmation-code">Confirmation Code</Label>
                <div className="flex justify-center">
                  <Controller
                    name="confirmationCode"
                    control={resetForm.control}
                    render={({ field }) => (
                      <InputOTP 
                        maxLength={6} 
                        value={field.value} 
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
                {resetForm.formState.errors.confirmationCode && (
                  <p className="text-xs text-red-500 text-center">
                    {resetForm.formState.errors.confirmationCode.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`pr-10 ${resetForm.formState.errors.password ? "border-red-500" : ""}`}
                    {...resetForm.register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength <= 2
                            ? "text-red-500"
                            : passwordStrength <= 3
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {resetForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{resetForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`pr-10 ${resetForm.formState.errors.confirmPassword ? "border-red-500" : ""}`}
                    {...resetForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {!showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && !resetForm.formState.errors.confirmPassword && (
                  <div className="mt-1 flex items-center text-xs">
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span className="text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!resetForm.formState.isValid || resetForm.formState.isSubmitting}
              >
                {resetForm.formState.isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            <div className="space-y-3">
              <Button 
                onClick={handleResendEmail} 
                disabled={resetForm.formState.isSubmitting} 
                variant="outline" 
                className="w-full"
              >
                Resend email
              </Button>

              <Link href="/signin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@laboratory.com"
                className={`w-full ${emailForm.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email ? (
                <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
              ) : (
                <p className="text-xs text-gray-600">Enter the email address associated with your LabAssist account</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={!emailForm.formState.isValid || emailForm.formState.isSubmitting}
          >
            {emailForm.formState.isSubmitting ? "Sending instructions..." : "Send reset instructions"}
          </Button>

          <div className="space-y-3">
            <div className="text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to sign in
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Need help?</h4>
            <p className="text-xs text-gray-600 mb-3">
              If you're having trouble accessing your account, our support team is here to help.
            </p>
            <Link href="/support" className="text-xs font-medium text-blue-600 hover:text-blue-500">
              Contact support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
