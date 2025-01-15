"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
            <Toaster />
        </SessionProvider>
    )
}