"use client"

import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle, ArrowLeft, ShipWheel, AnchorIcon } from "lucide-react"
import { setUser } from "@/src/redux/slices/userSlice"
import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    institution: "",
    contactPhone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }, []);

  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }, []);

  const getPasswordStrengthColor = useCallback(() => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }, [passwordStrength]);

  const getPasswordStrengthText = useCallback(() => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Medium"
    return "Strong"
  }, [passwordStrength]);

  const handleSubmit = useCallback(async(e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { agreeToTerms, confirmPassword, ...submitData } = formData;

      const response = await apiClient.post("/api/users", submitData);

      if(response.success) {
        document.cookie = `${CONFIRMED_EMAIL}=${response.data.confirmedEmail}; path=/; max-age=3600`;
        dispatch(setUser(response.data));
        router.push("/signin");
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false)
    }
  }, [formData, router]);

  const isFormValid = useMemo(() => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.address &&
      formData.institution &&
      formData.contactPhone &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms &&
      passwordStrength >= 3
    )
  }, [formData, passwordStrength]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <AnchorIcon className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Join the leading maritime supply management platform</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Institution / Company */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution/Organization</Label>
                <Input
                    id="institution"
                    name="institution"
                    type="text"
                    placeholder="MyCompany Inc."
                    value={formData.institution}
                    onChange={handleInputChange}
                />
              </div>
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Research Drive, Science City, SC 12345"
                    value={formData.address}
                    onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@laboratory.com"
                    value={formData.email}
                    onChange={handleInputChange}
                />
              </div>
              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
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
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
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
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
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
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!isFormValid || isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
