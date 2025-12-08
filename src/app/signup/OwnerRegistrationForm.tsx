"use client"

import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from "lucide-react"
import { UserType, OwnerFormData, OwnerSubmitData } from "./types"
import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"

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
  const [formData, setFormData] = useState<OwnerFormData>({
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
      userType: UserType.ORGANIZATION_OWNER,
    })
  }, [formData, onSubmit])

  const isFormValid = useMemo(() => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.address &&
      formData.institution &&
      formData.contactPhone &&
      formData.organizationName &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms &&
      passwordStrength >= 3
    )
  }, [formData, passwordStrength])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="owner-organizationName">Organization Name *</Label>
        <Input
          id="owner-organizationName"
          name="organizationName"
          type="text"
          required
          placeholder="Maritime Shipping Co."
          value={formData.organizationName}
          onChange={handleInputChange}
          className="border-blue-200 focus:border-blue-500"
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner-firstName">First Name *</Label>
          <Input
            id="owner-firstName"
            name="firstName"
            type="text"
            required
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-lastName">Last Name *</Label>
          <Input
            id="owner-lastName"
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Institution / Company */}
        <div className="space-y-2">
          <Label htmlFor="owner-institution">Institution/Company *</Label>
          <Input
            id="owner-institution"
            name="institution"
            type="text"
            required
            placeholder="MyCompany Inc."
            value={formData.institution}
            onChange={handleInputChange}
          />
        </div>
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="owner-address">Address *</Label>
          <Input
            id="owner-address"
            name="address"
            type="text"
            required
            placeholder="123 Harbor Street"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner-email">Email *</Label>
          <Input
            id="owner-email"
            name="email"
            type="email"
            required
            placeholder="contact@company.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-contactPhone">Contact Phone *</Label>
          <Input
            id="owner-contactPhone"
            name="contactPhone"
            type="tel"
            required
            placeholder="+1 (555) 123-4567"
            value={formData.contactPhone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="owner-password">Password</Label>
        <div className="relative">
          <Input
            id="owner-password"
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
        <Label htmlFor="owner-confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="owner-confirmPassword"
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
          id="owner-agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
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
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? "Creating account..." : "Create Organization Account"}
      </Button>
    </form>
  )
}

