"use client"

import { usePathname } from "next/navigation"
import { useAdminProfile } from "@/hooks/use-admin-profile"
import { AccessDenied } from "@/components/ui/access-denied"
import { ReactNode } from "react"

import { ALLOWED_ROUTES_FOR_NON_SUPER } from "@/lib/constants"

export function PermissionGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const { role, isLoading } = useAdminProfile()

    // Public pages like login don't need guard
    if (pathname === "/login") return <>{children}</>

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Role-based logic
    if (role === "superadmin") {
        return <>{children}</>
    }

    // Check if the current path is allowed for non-superadmins
    // We check if the pathname starts with any of the allowed routes (excluding root "/")
    // or if it's exactly root "/"
    const isAllowed = ALLOWED_ROUTES_FOR_NON_SUPER.some(route => {
        if (route === "/") return pathname === "/"
        return pathname.startsWith(route)
    })

    if (!isAllowed) {
        return <AccessDenied />
    }

    return <>{children}</>
}
