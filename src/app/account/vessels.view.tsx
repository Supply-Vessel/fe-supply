"use client"

import { Building2, Plus, Users, Calendar, MapPin, Mail, User, ChevronRight, Search, BriefcaseBusiness, Crown, Ship, CreditCard, UserPlus, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { useMediaQuery } from "@/src/components/sidebar-provider"
import { getUserInitials } from "@/src/lib/getUserInitials"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import type { VesselsViewProps } from "./types"

export default function VesselsView(
    {
        setIsInviteDialogOpen,
        isInviteDialogOpen,
        handleCreateVessel,
        handleInviteSubmit,
        handleVesselClick,
        canInviteMembers,
        canCreateVessel,
        filteredVessels,
        organizations,
        setSearchTerm,
        setInviteForm,
        handleLogout,
        searchTerm,
        formatDate,
        inviteForm,
        isInviting,
        isLoading,
        userInfo,
        userType,
    }: VesselsViewProps) {
    const isMobile = useMediaQuery("(max-width: 768px)")
    if (isLoading) {
        return (
        <div className="min-h-screen bg-gray-50">
            {/* Loading skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="animate-pulse">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-48"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        )
    }

    const isOrganizationOwner = userType === 'ORGANIZATION_OWNER';

    // Get organizations where user can invite (Admin/Manager/Owner)
    const invitableOrganizations = organizations.filter(org => 
        org.isOwner || org.memberRole === 'ADMIN' || org.memberRole === 'MANAGER'
    );

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header with user info */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                                {userInfo && getUserInitials(userInfo.firstName || "", userInfo.lastName || "")}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {userInfo?.firstName} {userInfo?.lastName}
                                    </h1>
                                    {isOrganizationOwner && (
                                        <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                                            <Crown className="h-3 w-3" />
                                            Organization Owner
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {userInfo?.institution}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Member since {userInfo && formatDate(userInfo.createdAt)}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-1" />
                                        {userInfo?.email}
                                    </div>
                                    {userInfo?.address && (
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {userInfo.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 m-auto md:m-0">
                            {canInviteMembers && (
                                <Button 
                                    onClick={() => setIsInviteDialogOpen(!isInviteDialogOpen)} 
                                    variant="outline" 
                                    className="flex items-center"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {isMobile ? "Invite" : "Invite to Organization"}
                                </Button>
                            )}
                            {canCreateVessel && (
                                <Button onClick={handleCreateVessel} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                                    <Plus className="h-4 w-4" />
                                    {isMobile ? "Create" : "Create / Join New Vessel"}
                                </Button>
                            )}
                            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 flex items-center">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Organizations Section */}
                {organizations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {isOrganizationOwner ? "Your Organizations" : "Organizations"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {organizations.map((org) => (
                                <Card key={org.id} className="border-l-4 border-l-blue-600">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Building2 className="h-5 w-5 text-blue-600" />
                                                    {org.name}
                                                </CardTitle>
                                                {org.description && (
                                                    <CardDescription className="mt-1">
                                                        {org.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            {org.isOwner && (
                                                <Badge className="bg-amber-100 text-amber-700">
                                                    <Crown className="h-3 w-3 mr-1" />
                                                    Owner
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span>{org.stats.membersCount} members</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Ship className="h-4 w-4 mr-2" />
                                                <span>{org.stats.vesselsCount} vessels</span>
                                            </div>
                                        </div>
                                        
                                        {org.subscription && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        <span>{org.subscription.planName}</span>
                                                    </div>
                                                    <Badge variant="outline" className="text-green-600 border-green-200">
                                                        {org.subscription.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}

                                        {!org.isOwner && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <User className="h-4 w-4 mr-2" />
                                                    <span>Your role: </span>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {org.memberRole}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and filters */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Your Vessels</h2>
                            <p className="text-gray-600 mt-1">
                                {filteredVessels.length} vessel{filteredVessels.length !== 1 ? "s" : ""} available
                            </p>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search vessels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Vessel cards */}
                {filteredVessels.length === 0 ? (
                <div className="text-center py-12">
                    <Ship className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No vessels found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search terms."
                            : "Get started by creating a new vessel or join an existing one."}
                    </p>
                    {canCreateVessel && (
                        <div className="mt-6 flex justify-center space-x-3">
                            <Button onClick={handleCreateVessel} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Create / Join New Vessel
                            </Button>
                        </div>
                    )}
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVessels.map((vessel) => (
                    <Card
                        key={vessel.id}
                        className="hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                        onClick={() => handleVesselClick(vessel.organizationName, vessel.name)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {vessel.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {vessel.organizationName && (
                                            <div className="flex gap-1 items-center text-sm text-gray-500 mb-1">
                                                <Building2 className="h-3 w-3" />
                                                {vessel.organizationName}
                                            </div>
                                        )}
                                        <div className="flex gap-1 items-center text-sm text-gray-600">
                                            <User className="h-3 w-3" />
                                            <p>Owner:</p>
                                            {vessel.username}
                                        </div>
                                        <Badge variant="secondary" className="flex gap-1 w-fit mt-1 text-xs">
                                            <p>Position:</p>
                                            {vessel.position}
                                        </Badge>
                                        <div className="flex gap-1 items-center text-sm text-gray-600">
                                            <BriefcaseBusiness className="h-3 w-3" />
                                            <p>Your role:</p>
                                            {vessel.userRole}
                                        </div>
                                    </CardDescription>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {vessel.description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{vessel.description}</p>}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Created {vessel && formatDate(vessel.createdAt)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                )}
            </div>

            {/* Invite Member Dialog */}
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Invite to Organization</DialogTitle>
                        <DialogDescription>
                            Send an invitation to join your organization. They will receive an email with an invitation code.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {invitableOrganizations.length > 1 && (
                            <div className="grid gap-2">
                                <Label htmlFor="organization">Organization *</Label>
                                <Select
                                    value={inviteForm.organizationId}
                                    onValueChange={(value) =>
                                        setInviteForm({ ...inviteForm, organizationId: value })
                                    }
                                >
                                    <SelectTrigger id="organization">
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {invitableOrganizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id}>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    {org.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="invite-email">Email Address *</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteForm.email}
                                onChange={(e) =>
                                    setInviteForm({ ...inviteForm, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="invite-role">Organization Role *</Label>
                            <Select
                                value={inviteForm.orgRole}
                                onValueChange={(value) =>
                                    setInviteForm({ ...inviteForm, orgRole: value })
                                }
                            >
                                <SelectTrigger id="invite-role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">
                                        <div>
                                            <div className="font-medium">Admin</div>
                                            <div className="text-xs text-gray-500">Full organization access</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="MANAGER">
                                        <div>
                                            <div className="font-medium">Manager</div>
                                            <div className="text-xs text-gray-500">Can manage vessels and invite users</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="MEMBER">
                                        <div>
                                            <div className="font-medium">Member</div>
                                            <div className="text-xs text-gray-500">Access to assigned vessels only</div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleInviteSubmit}
                            disabled={!inviteForm.email || !inviteForm.organizationId || isInviting}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {isInviting ? "Sending..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
