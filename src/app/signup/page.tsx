"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ArrowLeft, AnchorIcon, Building2, Users } from "lucide-react"
import RegularRegistrationForm from "./RegularRegistrationForm"
import { OwnerSubmitData, RegularSubmitData } from "./types"
import OwnerRegistrationForm from "./OwnerRegistrationForm"
import { setUser } from "@/src/redux/slices/userSlice"
import { CONFIRMED_EMAIL } from "@/src/lib/variables"
import React, { useCallback, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"
import { useRouter } from "next/navigation"
import Link from "next/link"


export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<"owner" | "regular">("owner")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleGoBack = () => {
    router.push("/")
  }

  const handleOwnerSubmit = useCallback(async (data: OwnerSubmitData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.post("/api/users", data)

      if (response.success) {
        document.cookie = `${CONFIRMED_EMAIL}=${response.data.confirmedEmail}; path=/; max-age=3600`
        dispatch(setUser(response.data))
        setSuccess("Account created successfully!")
        router.push("/signin")
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [router, dispatch])

  const handleRegularSubmit = useCallback(async (data: RegularSubmitData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.post("/api/users", data)

      if (response.success) {
        document.cookie = await `${CONFIRMED_EMAIL}=${response.data.confirmedEmail}; path=/; max-age=3600`
        dispatch(setUser(response.data))
        setSuccess("Account created successfully!")
        router.push("/signin")
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [router, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
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
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <AnchorIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the leading maritime supply management platform
          </p>
        </div>

        <Card className="w-full">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "owner" | "regular")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Create Organization
              </TabsTrigger>
              <TabsTrigger value="regular" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Join by Invitation
              </TabsTrigger>
            </TabsList>

            {/* ORGANIZATION OWNER TAB */}
            <TabsContent value="owner">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Organization</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    From $49/month
                  </Badge>
                </div>
                <CardDescription>
                  Create your organization and become the owner. Manage vessels, invite team members, and handle subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OwnerRegistrationForm
                  onSubmit={handleOwnerSubmit}
                  isLoading={isLoading}
                  error={error}
                  success={success}
                />
              </CardContent>
            </TabsContent>

            {/* REGULAR USER TAB */}
            <TabsContent value="regular">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Join by Invitation</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Free
                  </Badge>
                </div>
                <CardDescription>
                  Join an existing organization using an invitation code from your administrator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegularRegistrationForm
                  onSubmit={handleRegularSubmit}
                  onSwitchToOwner={() => setActiveTab("owner")}
                  isLoading={isLoading}
                  error={error}
                  success={success}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
