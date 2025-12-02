import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/src/components/ui/alert-dialog";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/src/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import { Mail, Phone, Plus, Search, Trash2, UserPlus } from "lucide-react";
import type { RequestEnums } from "@/src/components/requests/types";
import { NewMemberTypes, VesselMembersTypes } from "./types";
import { Card, CardContent } from "@/src/components/ui/card";
import { getUserInitials } from "@/src/lib/getUserInitials";
import { AccessStatus, Role } from "../../account/types";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/src/components/ui/button";
import { Avatar } from "@/src/components/ui/avatar";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";

interface TeamViewProps {
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setNewMember: Dispatch<SetStateAction<NewMemberTypes>>;
    setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    setRoleFilter: Dispatch<SetStateAction<string>>;
    handleDeleteMember: (id: string) => void;
    filteredMembers: VesselMembersTypes[];
    members: VesselMembersTypes[];
    isDeleteDialogOpen: boolean;
    handleAddMember: () => void;
    requestEnums: RequestEnums;
    confirmDelete: () => void;
    newMember: NewMemberTypes;
    isAddDialogOpen: boolean;
    searchQuery: string;
    roleFilter: string;
    userId: string;
}

export default function TeamView (props: TeamViewProps) {
    const {
        setIsDeleteDialogOpen,
        setIsAddDialogOpen,
        handleDeleteMember,
        isDeleteDialogOpen,
        isAddDialogOpen,
        filteredMembers,
        handleAddMember,
        setSearchQuery,
        setRoleFilter,
        confirmDelete,
        setNewMember,
        searchQuery,
        requestEnums,
        roleFilter,
        newMember,
        members,
        userId,
    } = props;

    const vesselOwner = members.find((member) => userId === member.userId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
                <p className="text-gray-500">
                Manage your vessel team and personnel
                </p>
            </div>
            <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddDialogOpen(true)}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
            </Button>
            </div>
    
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                    type="search"
                    placeholder="Search members..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"ALL ROLES"}>
                            ALL ROLES
                        </SelectItem>
                        {requestEnums?.role?.map((role) => (
                        <SelectItem key={role} value={role}>
                            {role}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>
    
            <div className="grid grid-cols-1 text-sm text-gray-600">
            Showing {filteredMembers.length} of {members.length} members
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member: VesselMembersTypes) => (
                <Card
                key={member.id}
                className={member.userId === userId ? "overflow-hidden hover:shadow-lg transition-shadow border-blue-600" : "overflow-hidden hover:shadow-lg transition-shadow"}
                >
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-16 w-16 bg-blue-600 text-white text-lg flex items-center justify-center font-semibold">
                            {member && getUserInitials(member.user.firstName || "", member.user.lastName || "")}
                        </Avatar>
                        {(member.role !== Role.SUPPLIER && member?.userId !== userId && vesselOwner?.role === Role.SUPPLIER) &&
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteMember(member.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete member</span>
                            </Button>
                        }
                    </div>
    
                    <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg">{member.user.firstName || ""} {member.user.lastName || ""}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
    
                    <div className="flex items-center gap-2">
                        {member.user.address && (
                            <Badge variant="secondary" className="text-xs">
                                {member.user.address}
                            </Badge>
                        )}
                        <Badge
                            variant={
                                member.accessStatus === AccessStatus.ACTIVE ? "default" : "secondary"
                            }
                            className={
                                member.accessStatus === AccessStatus.ACTIVE
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : ""
                            }
                        >
                            {member.accessStatus}
                        </Badge>
                    </div>
    
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a
                            href={`mailto:${member.user.email}`}
                            className="hover:text-blue-600 truncate"
                        >
                            {member.user.email}
                        </a>
                        </div>
                        {member.user.contactPhone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{member.user.contactPhone}</span>
                            </div>
                        )}
                    </div>
    
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Active Experiments</span>
                        <span className="font-semibold text-blue-600">
                            {"-"}
                        </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Join Date</span>
                        <span className="font-medium">{new Date(member.joinedAt).toISOString().split('T')[0]}</span>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
    
            {filteredMembers.length === 0 && (
            <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No members found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
                </p>
            </div>
            )}
    
            {/* Add Member Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new team member below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                            value={newMember.role}
                            onValueChange={(value) =>
                                setNewMember({ ...newMember, role: value })
                            }
                        >
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {requestEnums?.role?.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@labassist.com"
                        value={newMember.email}
                        onChange={(e) =>
                            setNewMember({ ...newMember, email: e.target.value })
                        }
                        />
                    </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddMember}
                    disabled={
                        !newMember.role ||
                        !newMember.email
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    
            {/* Delete Confirmation Dialog */}
            <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        team member from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={confirmDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}