"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/src/components/sidebar-provider"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Button } from "@/src/components/ui/button"
import { AuthService } from "../lib/auth"
import { cn } from "@/src/lib/utils"
import type React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  ChevronLeft,
  PackageOpen,
  BookUser,
  LogOut,
  IdCard,
  Ship,
} from "lucide-react"

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const params = useParams();
  const { userId, vesselId } = params;
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = () => {
    AuthService.logout();
  }

  return (
    <div className={cn("sticky top-0 z-50 h-screen border-r bg-white transition-all duration-300", isOpen ? "w-64" : "w-16")}>
      <div className="flex h-16 items-center justify-between px-4">
        <div className={cn("flex items-center", isOpen ? "justify-start" : "justify-center w-full")}>
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div onClick={toggle} className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
                <Ship className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-bold text-lg">{vesselId}</span>
            </div>
          ) : (
            <div onClick={toggle} className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
              <Ship className="h-4 w-4 text-blue-600" />
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", !isOpen && "hidden")} onClick={toggle}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-3 py-2">
          <nav className="flex flex-col gap-1">
            <NavItem
              href={`/${vesselId}/dashboard`}
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={pathname === `/${vesselId}/dashboard`}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${vesselId}/requests`}
              icon={PackageOpen}
              label="Requests Status"
              isActive={pathname.startsWith(`/${vesselId}/requests`)}
              isOpen={isOpen}
            />
            <NavItem
              href={`/${vesselId}/team`}
              icon={BookUser}
              label="Team"
              isActive={pathname.startsWith(`/${vesselId}/team`)}
              isOpen={isOpen}
            />
          </nav>
        </div>
      </ScrollArea>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-gray-500 hover:text-gray-900", !isOpen && "justify-center px-0")}
          onClick={() => {router.push("/account")}}
        >
          <IdCard className="h-4 w-4 mr-2" />
          {isOpen && <span>Account / Vessels</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-gray-500 hover:text-gray-900", !isOpen && "justify-center px-0")}
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isOpen && <span>Log out</span>}
        </Button>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  isOpen: boolean
}

function NavItem({ href, icon: Icon, label, isActive, isOpen }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
        !isOpen && "justify-center px-0",
      )}
    >
      <Icon className="h-4 w-4" />
      {isOpen && <span>{label}</span>}
    </Link>
  )
}
