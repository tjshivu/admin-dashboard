"use client"

import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { useRouter } from "next/navigation"

export function AccessDenied() {
    const router = useRouter()

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-neutral-950 min-h-[60vh]">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShieldAlert className="h-10 w-10 text-rose-600 dark:text-rose-400" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                Access Restricted
            </h1>

            <p className="text-slate-500 dark:text-neutral-400 text-center max-w-md mb-8 leading-relaxed">
                You do not have the required permissions to view this section.
                Please contact a Super Administrator if you believe this is an error.
            </p>

            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-slate-200 dark:border-neutral-800"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>

                <Button
                    onClick={() => router.push("/admin")}
                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    )
}
