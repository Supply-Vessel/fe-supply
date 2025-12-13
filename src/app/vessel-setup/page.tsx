"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Building2, Users, CheckCircle, AlertCircle, Ship, Loader2, ArrowLeft } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { setLaboratory } from "@/src/redux/slices/laboratorySlice"
import { useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/src/components/ui/textarea"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"
import { AuthService } from "@/src/lib/auth"
import { Role } from "../account/types"
import { toast } from "sonner"

interface Organization {
    id: string;
    name: string;
    ownerId: string;
}

const VesselSetupPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const tabFromUrl = searchParams.get('tab')
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
    const [activeTab, setActiveTab] = useState(tabFromUrl && ['create', 'join'].includes(tabFromUrl) ? tabFromUrl : 'create')
    
    // Organizations for vessel creation
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [selectedOrgId, setSelectedOrgId] = useState<string>("")
    const [canCreateVessel, setCanCreateVessel] = useState(false)

    // Create vessel form state
    const [vesselData, setVesselData] = useState({
        description: "",
        username: "",
        position: "",
        name: "",
    })
    
    // Join vessel state
    const [invitationCode, setInvitationCode] = useState("");

    const dispatch = useAppDispatch();

    // Fetch organizations on mount
    useEffect(() => {
        const fetchOrganizations = async () => {
            setIsLoadingOrgs(true);
            try {
                const user = await AuthService.getCurrentUser();
                if (!user) {
                    router.push('/signin');
                    return;
                }

                const response = await apiClient.get(`/api/vessel?userId=${user.userId}`);
                
                if (response.success && response.data) {
                    setOrganizations(response.data);
                    setCanCreateVessel(response.data.length > 0);
                    
                    // Auto-select first organization if only one
                    if (response.data.length === 1) {
                        setSelectedOrgId(response.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch organizations:', error);
            } finally {
                setIsLoadingOrgs(false);
            }
        };

        fetchOrganizations();
    }, [router]);

    const handleVesselInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

            if (!selectedOrgId) {
                setError("Please select an organization");
                setIsLoading(false);
                return;
            }

            const vesselDataToSend = {
                ...vesselData,
                userId: user.userId,
                organizationId: selectedOrgId,
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
    }, [vesselData, selectedOrgId, router, dispatch]);

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
        return vesselData.name.trim() !== "" && selectedOrgId !== ""
    }, [vesselData, selectedOrgId]);

    const isJoinFormValid = useMemo(() => {
        return invitationCode.length === 6
    }, [invitationCode]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="flex justify-start">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>
                <div className="w-full space-y-8">
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
                            <TabsTrigger value="create" className="flex items-center gap-2" disabled={!canCreateVessel && !isLoadingOrgs}>
                                <Building2 className="h-4 w-4" />
                                Create Vessel
                            </TabsTrigger>
                            <TabsTrigger value="join" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Join Org / Vessel
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="create">
                            <CardHeader>
                                <CardTitle>Create New Vessel</CardTitle>
                                <CardDescription>
                                    Create a new vessel within your organization. You'll be able to invite team members and manage all
                                    aspects of your vessel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingOrgs ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                        <span className="ml-2 text-gray-600">Loading organizations...</span>
                                    </div>
                                ) : !canCreateVessel ? (
                                    <div className="text-center py-8">
                                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations available</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            You need to be an admin or manager of an organization to create vessels.
                                        </p>
                                        <Button 
                                            onClick={() => router.push('/signup')} 
                                            className="mt-4"
                                            variant="outline"
                                        >
                                            Create an Organization
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCreateVessel} className="space-y-4">
                                        {/* Organization Select */}
                                        <div className="space-y-2">
                                            <Label htmlFor="organization">Organization *</Label>
                                            <Select
                                                value={selectedOrgId}
                                                onValueChange={setSelectedOrgId}
                                            >
                                                <SelectTrigger id="organization" className="border-blue-200">
                                                    <SelectValue placeholder="Select organization" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org.id} value={org.id}>
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-4 w-4 text-blue-600" />
                                                                {org.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500">
                                                Select the organization this vessel will belong to
                                            </p>
                                        </div>

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
                                                    onChange={handleVesselInputChange}
                                                />
                                            </div>

                                            {/* Position */}
                                            <div className="space-y-2">
                                                <Label htmlFor="position">Position *</Label>
                                                <Select
                                                    value={vesselData.position}
                                                    onValueChange={(value) =>
                                                        setVesselData({ ...vesselData, position: value })
                                                    }
                                                >
                                                    <SelectTrigger id="position">
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(Role).map((position) => (
                                                            <SelectItem key={position} value={position}>
                                                                {position}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name">Vessel Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="MV Atlantic Explorer"
                                                value={vesselData.name}
                                                onChange={handleVesselInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="Brief description of your vessel..."
                                                value={vesselData.description}
                                                onChange={handleVesselInputChange}
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
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Creating Vessel...
                                                </>
                                            ) : (
                                                "Create Vessel"
                                            )}
                                        </Button>
                                    </form>
                                )}
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
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Joining Vessel...
                                            </>
                                        ) : (
                                            "Join Vessel"
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Don't have an invitation code?{" "}
                                            {canCreateVessel ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab("create")}
                                                    className="font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    Create your own vessel
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/signup')}
                                                    className="font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    Create an organization first
                                                </button>
                                            )}
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
        </div>
    )
}

const Page = () => (
    <Suspense fallback={<div>Загрузка...</div>}>
      <VesselSetupPage />
    </Suspense>
  );
  
  export default Page;
