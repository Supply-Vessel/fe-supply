"use client"

import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useCallback, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { UserType, OwnerSubmitData } from "./types"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { z } from "zod"

// Zod схема валидации
const ownerFormSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .regex(/^\S+$/, "Organization name must not contain spaces"),
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
  address: z
    .string()
    .min(1, "Address is required"),
  institution: z
    .string()
    .min(1, "Institution/Company is required"),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type OwnerFormValues = z.infer<typeof ownerFormSchema>

interface OwnerRegistrationFormProps {
  onSubmit: (data: OwnerSubmitData) => Promise<void>
  isLoading: boolean
  error: string
  success: string
}

export default function OwnerRegistrationForm({ 
  onSubmit, 
  isLoading, 
  error, 
  success 
}: OwnerRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      institution: "",
      contactPhone: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      agreeToTerms: false,
    },
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }, [])

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

  const onFormSubmit = async (data: OwnerFormValues) => {
    const { agreeToTerms, confirmPassword, ...submitData } = data
    await onSubmit({
      ...submitData,
      userType: UserType.ORGANIZATION_OWNER,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="owner-organizationName">Organization Name *</Label>
        <Input
          id="owner-organizationName"
          type="text"
          placeholder="MaritimeShippingCo"
          {...register("organizationName")}
          className={`border-blue-200 focus:border-blue-500 ${errors.organizationName ? "border-red-500" : ""}`}
        />
        {errors.organizationName && (
          <p className="text-sm text-red-500">{errors.organizationName.message}</p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner-firstName">First Name *</Label>
          <Input
            id="owner-firstName"
            type="text"
            placeholder="John"
            {...register("firstName")}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-lastName">Last Name *</Label>
          <Input
            id="owner-lastName"
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Institution / Company */}
        <div className="space-y-2">
          <Label htmlFor="owner-institution">Institution/Company *</Label>
          <Input
            id="owner-institution"
            type="text"
            placeholder="MyCompany Inc."
            {...register("institution")}
            className={errors.institution ? "border-red-500" : ""}
          />
          {errors.institution && (
            <p className="text-sm text-red-500">{errors.institution.message}</p>
          )}
        </div>
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="owner-address">Address *</Label>
          <Input
            id="owner-address"
            type="text"
            placeholder="123 Harbor Street"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner-email">Email *</Label>
          <Input
            id="owner-email"
            type="email"
            placeholder="contact@company.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-contactPhone">Contact Phone *</Label>
          <Input
            id="owner-contactPhone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...register("contactPhone")}
            className={errors.contactPhone ? "border-red-500" : ""}
          />
          {errors.contactPhone && (
            <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="owner-password">Password *</Label>
        <div className="relative">
          <Input
            id="owner-password"
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
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

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
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="owner-confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="owner-confirmPassword"
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
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}

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
      </div>
      
      {/* Terms */}
      <div className="space-y-1">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="owner-agreeToTerms"
            {...register("agreeToTerms")}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="owner-agreeToTerms" className="ml-2 text-sm text-gray-700">
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
          <p className="text-sm text-red-500 ml-6">{errors.agreeToTerms.message}</p>
        )}
      </div>

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
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={!isValid || isLoading}
      >
        {isLoading ? "Creating account..." : "Create Organization Account"}
      </Button>
    </form>
  )
}
