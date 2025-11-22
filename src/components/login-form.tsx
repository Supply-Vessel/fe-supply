"use client"

import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { setUser } from "@/src/redux/slices/userSlice"
import React, { useCallback, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { CONFIRMED_EMAIL } from "../lib/variables"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { AuthService } from "@/src/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await AuthService.login(email || process.env.NEXT_PUBLIC_GUEST_EMAIL as string, password || process.env.NEXT_PUBLIC_GUEST_PASSWORD as string);
      toast(`${response.message || response.error}`, {
        description: `${response?.user.firstName} ${response?.user.lastName} - ${response?.user.institution}`
      });
      
      if(response.success) {
        if(!response.vessel) {
          router.push("/vessel-setup");
        } else {
          router.push(`/account`);
        }
        document.cookie = `USER_ID=${response.user.userId}; path=/; SameSite=Strict`;
        document.cookie = `${CONFIRMED_EMAIL}=${response.user.confirmedEmail}; path=/; max-age=3600`;
        dispatch(setUser(response.user));
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false)
    }
  }, [email, password, router]);

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@supply.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
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
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  )
}
