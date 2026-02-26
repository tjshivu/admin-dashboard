import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

import { ToastProvider } from "@/components/providers/toast-provider"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
                <Sidebar />
                <div className="flex-1 overflow-hidden flex flex-col min-h-screen transition-all duration-300">
                    <Header />
                    <main className="flex flex-1 flex-col">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    )
}
