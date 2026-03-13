"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/layout/sidebar"
import { Header } from "@/components/admin/layout/header"
import { ToastProvider } from "@/components/admin/providers/toast-provider"
import { NotificationProvider } from "@/components/admin/providers/notification-provider"
import { PermissionGuard } from "@/components/admin/auth/permission-guard"
import { AnimatePresence, motion } from "framer-motion"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    // Close sidebar on navigation
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    return (
        <ToastProvider>
            <NotificationProvider>
                <div className="flex min-h-screen w-full bg-slate-50 dark:bg-neutral-950 relative overflow-hidden">
                    {/* Desktop Sidebar */}
                    <Sidebar />

                    {/* Mobile Sidebar Overlay */}
                    <AnimatePresence>
                        {sidebarOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSidebarOpen(false)}
                                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[55] md:hidden"
                                />
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="fixed inset-y-0 left-0 z-[60] md:hidden"
                                >
                                    <Sidebar mobile onClose={() => setSidebarOpen(false)} />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 overflow-hidden flex flex-col min-h-screen transition-all duration-300">
                        <Header onMenuClick={() => setSidebarOpen(true)} />
                        <main className="flex flex-1 flex-col overflow-x-hidden">
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
