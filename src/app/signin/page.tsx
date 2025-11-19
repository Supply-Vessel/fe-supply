"use client";

import { EmailConfirmation } from "@/src/components/email-confirmation";
import type { RootState } from "@/src/redux/store/store";
import { LoginForm } from "@/src/components/login-form";
import { CONFIRMED_EMAIL } from "@/src/lib/variables";
import { Button } from "@/src/components/ui/button";
import { useAppSelector } from "@/src/lib/hooks";
import { getCookie } from "@/src/lib/cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ship, ShipWheel } from "lucide-react";

export default function LoginPage() {
  const [confirmedEmail, setConfirmedEmail] = useState<boolean>(true);
  const user = useAppSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    const email = getCookie(CONFIRMED_EMAIL);
    if (email) {
      setConfirmedEmail(email === "true" ? true : false);
    }
  }, [user]);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
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
        
        {
          confirmedEmail ?
          (
            <>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ShipWheel className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                  ShipHub
                </h2>
                <p className="text-center text-sm text-gray-600">
                  Advanced Maritime Supply Management
                </p>
              </div>
              <LoginForm />
            </>
          )
          :
          (
            <EmailConfirmation />
          )
        }
      </div>
    </div>
  );
}
