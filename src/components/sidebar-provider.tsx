"use client"

import * as React from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)

    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

type SidebarContext = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = React.createContext<SidebarContext | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 600px)")
  const [isOpen, setIsOpen] = React.useState(true)

  React.useEffect(() => {
    if(isMobile) {
      setIsOpen(false)
    }
  }, [isMobile])

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return <SidebarContext.Provider value={{ isOpen, toggle, close }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
