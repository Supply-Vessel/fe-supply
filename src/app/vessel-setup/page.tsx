"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Building2, Users, CheckCircle, AlertCircle, Ship } from "lucide-react"
import React, { Suspense, useCallback, useMemo, useState } from "react"
import { setLaboratory } from "@/src/redux/slices/laboratorySlice"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/src/components/ui/textarea"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"
import { AuthService } from "@/src/lib/auth"
import { toast } from "sonner"

const VesselSetupPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const tabFromUrl = searchParams.get('tab')
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(tabFromUrl && ['create', 'join'].includes(tabFromUrl) ? tabFromUrl : 'create')
    // Create laboratory form state
    const [vesselData, setVesselData] = useState({
        description: "",
        username: "",
        position: "",
        name: "",
    })
    // Join laboratory state
    const [invitationCode, setInvitationCode] = useState("");

    const dispatch = useAppDispatch();

    const handleLaboratoryInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setVesselData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }, []);

    const handleCreateVessel = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const user = await AuthService.getCurrentUser();

            const vesselDataToSend = {
                ...vesselData,
                userId: user.userId,
            }
            const response = await apiClient.post("/api/vessel", vesselDataToSend);
            toast(response.success ? "Success!" : "Error!", {
                description: response.success ? `${response?.message} - ${response?.data?.name}` : response?.message
            })
            
            if(response.success) {
                dispatch(setLaboratory(response?.data));
                setSuccess("Vessel created successfully!");
                router.push(`/account`);
            } else {
                setError(response?.message);
            }
        } catch (error) {
            console.error('Failed to create Vessel:', error);
            setError("Failed to create Vessel. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [vesselData, router]);

    const handleJoinVessel = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const user = await AuthService.getCurrentUser();

            const userData = {
                code: invitationCode,
                userId: user.userId,
            }

            const response = await apiClient.post("/api/invitation/verification", userData);
            toast(response.success ? "Success!" : "Error!", {
                description: response.success ? `${response?.message}` : response?.message
            })
            
            if(response.success) {
                setSuccess("Congratulations, you have been successfully added to the vessel.");
                router.push(`/account`);
            } else {
                setError(response?.message);
            }
        } catch (err) {
            setError("Invalid invitation code. Please check and try again.")
        } finally {
            setIsLoading(false)
        }
    }, [invitationCode, router]);

    const isCreateFormValid = useMemo(() => {
        return vesselData.name.trim() !== ""
    }, [vesselData]);

    const isJoinFormValid = useMemo(() => {
        return invitationCode.length === 6
    }, [invitationCode]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
                        <Ship className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Set up your vessel</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create a new vessel or join an existing one to get started
                    </p>
                </div>

                <Card className="w-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Create Vessel
                    </TabsTrigger>
                    <TabsTrigger value="join" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Join Vessel
                    </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <CardHeader>
                            <CardTitle>Create New Vessel</CardTitle>
                            <CardDescription>
                            Set up your own vessel and become the owner. You'll be able to invite team members and manage all
                            aspects of your vessel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateVessel} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username *</Label>
                                        <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        placeholder="johndoe"
                                        value={vesselData.username}
                                        onChange={handleLaboratoryInputChange}
                                        />
                                    </div>

                                    {/* Position */}
                                    <div className="space-y-2">
                                        <Label htmlFor="position">Position *</Label>
                                        <Input
                                        id="position"
                                        name="position"
                                        type="text"
                                        required
                                        placeholder="Researchers"
                                        value={vesselData.position}
                                        onChange={handleLaboratoryInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Vessel Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Advanced Research Laboratory"
                                        value={vesselData.name}
                                        onChange={handleLaboratoryInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Brief description of your vessel's activities..."
                                        value={vesselData.description}
                                        onChange={handleLaboratoryInputChange}
                                        rows={3}
                                    />
                                </div>

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
                                    disabled={!isCreateFormValid || isLoading}
                                >
                                    {isLoading ? "Creating Vessel..." : "Create Vessel"}
                                </Button>
                            </form>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="join">
                        <CardHeader>
                            <CardTitle>Join Existing Vessel</CardTitle>
                            <CardDescription>
                                Enter the 6-digit invitation code provided by your vessel administrator to join an existing vessel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleJoinVessel} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="invitation-code">Invitation Code</Label>
                                    <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={invitationCode} onChange={(value) => setInvitationCode(value)}>
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
                                        Enter the 6-digit code provided by your vessel administrator
                                    </p>
                                </div>

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
                                    disabled={!isJoinFormValid || isLoading}
                                >
                                    {isLoading ? "Joining Vessel..." : "Join Vessel"}
                                </Button>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an invitation code?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("create")}
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Create your own vessel
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </TabsContent>
                </Tabs>
                </Card>

                {/* Help Section */}
                <div className="text-center">
                    <div className="bg-gray-50 rounded-md p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Need help getting started?</h4>
                        <p className="text-xs text-gray-600 mb-3">
                            Our team can help you set up your vessel and get your team onboarded quickly.
                        </p>
                        <Button variant="outline" size="sm">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Page = () => (
    <Suspense fallback={<div>Загрузка...</div>}>
      <VesselSetupPage />
    </Suspense>
  );
  
  export default Page;