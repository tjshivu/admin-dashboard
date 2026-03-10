import { Sidebar } from "@/components/admin/layout/sidebar"
import { Header } from "@/components/admin/layout/header"

import { ToastProvider } from "@/components/admin/providers/toast-provider"
import { NotificationProvider } from "@/components/admin/providers/notification-provider"
import { PermissionGuard } from "@/components/admin/auth/permission-guard"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ToastProvider>
            <NotificationProvider>
                <div className="flex min-h-screen w-full bg-slate-50 dark:bg-neutral-950">
                    <Sidebar />
                    <div className="flex-1 overflow-hidden flex flex-col min-h-screen transition-all duration-300">
                        <Header />
                        <main className="flex flex-1 flex-col">
                            <PermissionGuard>
                                {children}
                            </PermissionGuard>
                        </main>
                    </div>
                </div>
            </NotificationProvider>
        </ToastProvider>
    )
}
