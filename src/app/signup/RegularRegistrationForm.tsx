"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp"
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from "lucide-react"
import { UserType, RegularSubmitData } from "./types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useCallback, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
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

// Zod схема валидации
const regularFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
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
  invitationCode: z
    .string()
    .length(6, "Invitation code must be exactly 6 characters"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegularFormSchema = z.infer<typeof regularFormSchema>

interface RegularRegistrationFormProps {
  onSubmit: (data: RegularSubmitData) => Promise<void>
  onSwitchToOwner: () => void
  isLoading: boolean
  error: string
  success: string
}

export default function RegularRegistrationForm({ 
  onSubmit, 
  onSwitchToOwner,
  isLoading, 
  error, 
  success 
}: RegularRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<RegularFormSchema>({
    resolver: zodResolver(regularFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      invitationCode: "",
      agreeToTerms: false,
    },
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")
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

  const onFormSubmit = async (data: RegularFormSchema) => {
    const { agreeToTerms, confirmPassword, ...submitData } = data
    await onSubmit({
      ...submitData,
      userType: UserType.REGULAR,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Invitation Code */}
      <div className="space-y-2">
        <Label htmlFor="invitation-code">Invitation Code *</Label>
        <div className="flex justify-center py-2">
          <Controller
            name="invitationCode"
            control={control}
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
        {errors.invitationCode ? (
          <p className="text-xs text-red-500 text-center">{errors.invitationCode.message}</p>
        ) : (
          <p className="text-xs text-gray-600 text-center">
            Enter the 6-digit code provided by your organization administrator
          </p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regular-firstName">First Name *</Label>
          <Input
            id="regular-firstName"
            type="text"
            placeholder="John"
            {...register("firstName")}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="regular-lastName">Last Name *</Label>
          <Input
            id="regular-lastName"
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="regular-email">Email *</Label>
        <Input
          id="regular-email"
          type="email"
          placeholder="your.email@company.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email ? (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : (
          <p className="text-xs text-gray-500">
            Use the same email address that received the invitation
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="regular-password">Password *</Label>
        <div className="relative">
          <Input
            id="regular-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("password")}
            className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
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
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="regular-confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="regular-confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
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
        {confirmPassword && !errors.confirmPassword && (
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
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      
      {/* Terms */}
      <div className="flex items-start">
        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="regular-agreeToTerms"
              checked={field.value}
              onChange={field.onChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
        />
        <label htmlFor="regular-agreeToTerms" className="ml-2 text-sm text-gray-700">
          I agree to the{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
      )}

      {/* Error/Success messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700" 
        disabled={!isValid || isLoading}
      >
        {isLoading ? "Creating account..." : "Join Organization"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an invitation code?{" "}
          <button
            type="button"
            onClick={onSwitchToOwner}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create your own organization
          </button>
        </p>
      </div>
    </form>
  )
}
