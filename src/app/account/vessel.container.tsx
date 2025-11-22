"use client"

import type { VesselsContainerProps, Vessel, UserInfo } from "./types"
import { useState, useEffect, useCallback, useMemo } from "react"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import VesselsView from "./vessels.view"

export default function VesselsContainer({ userVessels }: VesselsContainerProps) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [vessels, setVessels] = useState<Vessel[] | []>(userVessels)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);

        const user = await AuthService.getCurrentUser();
        setUserInfo(user);

        setIsLoading(false);
        }

        fetchData()
    }, [])

    const filteredLaboratories = useMemo(() => 
        vessels?.filter(
            (vessel) =>
            vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
        [vessels, searchTerm]
    );

    const formatDate = useCallback((date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }
        
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long", 
            day: "numeric",
        }).format(dateObj);
    }, []);

    const getInitials = useCallback((firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`
    }, []);

    const handleLabClick = useCallback((vesselId: string) => {
        router.push(`/${vesselId}/dashboard`)
    }, [userInfo, router]);
    
    const handleJoinLab = useCallback(() => {
        router.push("/vessel-setup?tab=join")
    }, [router]);

    const handleCreateLab = useCallback(() => {
        router.push("/vessel-setup?tab=create")
    }, [router]);


    return (
        <VesselsView
            filteredLaboratories={filteredLaboratories}
            handleCreateLab={handleCreateLab}
            handleLabClick={handleLabClick}
            setSearchTerm={setSearchTerm}
            handleJoinLab={handleJoinLab}
            getInitials={getInitials}
            formatDate={formatDate}
            searchTerm={searchTerm}
            isLoading={isLoading}
            userInfo={userInfo}
        />
    )
}
