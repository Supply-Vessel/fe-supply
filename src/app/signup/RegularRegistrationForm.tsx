"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp"
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from "lucide-react"
import { UserType, RegularFormData, RegularSubmitData } from "./types"
import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"

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
  const [formData, setFormData] = useState<RegularFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    invitationCode: "",
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }, [calculatePasswordStrength])

  const handleInvitationCodeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, invitationCode: value }))
  }, [])

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const { agreeToTerms, confirmPassword, ...submitData } = formData
    await onSubmit({
      ...submitData,
      userType: UserType.REGULAR,
    })
  }, [formData, onSubmit])

  const isFormValid = useMemo(() => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.invitationCode.length === 6 &&
      formData.agreeToTerms &&
      passwordStrength >= 3
    )
  }, [formData, passwordStrength])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Invitation Code */}
      <div className="space-y-2">
        <Label htmlFor="invitation-code">Invitation Code *</Label>
        <div className="flex justify-center py-2">
          <InputOTP 
            maxLength={6} 
            value={formData.invitationCode} 
            onChange={handleInvitationCodeChange}
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
        </div>
        <p className="text-xs text-gray-600 text-center">
          Enter the 6-digit code provided by your organization administrator
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regular-firstName">First Name *</Label>
          <Input
            id="regular-firstName"
            name="firstName"
            type="text"
            required
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regular-lastName">Last Name *</Label>
          <Input
            id="regular-lastName"
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="regular-email">Email *</Label>
        <Input
          id="regular-email"
          name="email"
          type="email"
          required
          placeholder="your.email@company.com"
          value={formData.email}
          onChange={handleInputChange}
        />
        <p className="text-xs text-gray-500">
          Use the same email address that received the invitation
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="regular-password">Password</Label>
        <div className="relative">
          <Input
            id="regular-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            className="pr-10"
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
        {formData.password && (
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
        <Label htmlFor="regular-confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="regular-confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="pr-10"
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
        {formData.confirmPassword && (
          <div className="mt-1 flex items-center text-xs">
            {formData.password === formData.confirmPassword ? (
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
      <div className="flex items-start">
        <input
          type="checkbox"
          id="regular-agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
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
        disabled={!isFormValid || isLoading}
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

