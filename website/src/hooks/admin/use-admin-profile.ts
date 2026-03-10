import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/admin/api"

export type AdminRole = 'superadmin' | 'admin' | 'operational' | 'support' | 'analyst' | 'founder' | null

export function useAdminProfile() {
    const { data: profileData, isLoading } = useQuery({
        queryKey: ["admin-profile"],
        queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await get<any>("/admin/me")
            if (!res?.success) throw new Error("Failed to fetch admin profile")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (res as any).admin || res.data || null
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    })

    const role = (profileData?.role as AdminRole) || null

    let canCreate = false
    let canEdit = false
    let canDelete = false

    if (role === 'superadmin') {
        canCreate = true
        canEdit = true
        canDelete = true
    } else if (role === 'operational') {
        canCreate = true
        canEdit = true
        canDelete = false
    }

    return {
        adminProfile: profileData,
        role,
        canCreate,
        canEdit,
        canDelete,
        isLoading
    }

}
