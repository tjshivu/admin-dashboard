/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchSystemHealth } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Database, Server, RefreshCw } from "lucide-react"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { GridSystem } from "@/components/ui/grid-system"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import { useEffect } from "react"

export default function HealthPage() {
    const { data: health, isLoading, isError, error } = useQuery({
        queryKey: ['system-health'],
        queryFn: fetchSystemHealth,
        refetchInterval: 30000 // Refresh every 30 seconds
    }) as { data: any, isLoading: boolean, isError: boolean, error: unknown }

    const { markByEvent } = useNotifications()
    useEffect(() => {
        markByEvent("system_alert")
    }, [markByEvent])

    const [showRaw, setShowRaw] = useState(false)

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return `${h}h ${m}m ${s}s`
    }

    const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1) + " MB"

    if (isLoading) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Checking system health...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <div className="text-red-500">
                    Failed to load system health: {(error as Error).message}
                </div>
            </div>
        )
    }

    const logs = health?.logs || []
    const isDbConnected = health?.database?.readyState === 1

    return (
        <PageContainer>
            <SectionHeader
                title="System Health"
                action={
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-md border border-slate-200 dark:border-neutral-800 shadow-sm">
                        <RefreshCw className="h-4 w-4 animate-spin text-violet-500" />
                        Live Monitoring
                    </div>
                }
            />

            <div className="max-w-xl mx-auto mb-12">
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className="flex flex-col items-center mb-6">
                            <div className={cn(
                                "p-4 rounded-full mb-4",
                                isDbConnected ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500"
                            )}>
                                <Database className="h-8 w-8" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Database Connectivity</span>
                        </div>

                        <div className={cn(
                            "text-4xl font-black tracking-tight mb-2",
                            isDbConnected ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                        )}>
                            {isDbConnected ? 'Connected' : 'Disconnected'}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">
                            MongoDB Cluster: {health?.database?.status || (isDbConnected ? 'Operational' : 'Unknown')}
                        </p>
                    </CardContent>
                    {isDbConnected && (
                        <div className="bg-green-500 h-1.5 w-full"></div>
                    )}
                </Card>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-500" />
                    Service Activity Logs
                </h3>
            </div>

            <div className="mb-8">
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4 border-b dark:border-neutral-800 pb-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity Summary</h4>
                            <span className="text-xs text-slate-400 font-medium">{logs.length} logs in period</span>
                        </div>
                        <div className="space-y-4">
                            {logs.length > 0 ? (
                                <div className="pt-2">
                                    <span className="text-xs text-slate-400 dark:text-neutral-500 block mb-2 uppercase font-bold tracking-tight">Latest System Event</span>
                                    <div className="p-4 bg-slate-50 dark:bg-neutral-950/50 rounded-lg border border-slate-100 dark:border-neutral-800">
                                        <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed italic">
                                            "{logs[0]?.message}"
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                logs[0]?.level === 'error' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {logs[0]?.level || 'info'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {logs[0]?.service || 'system'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic text-center py-4">No recent logs available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm rounded-xl overflow-hidden mb-8">
                <div className="p-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/20 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Advanced Telemetry</h3>
                        <p className="text-xs text-slate-500 dark:text-neutral-400">Full raw system diagnostic output</p>
                    </div>
                    <button
                        onClick={() => setShowRaw(!showRaw)}
                        className="text-xs font-semibold px-3 py-1.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-colors uppercase tracking-wider dark:text-white"
                    >
                        {showRaw ? "Collapse Raw Data" : "Show Advanced Raw JSON"}
                    </button>
                </div>
                {showRaw && (
                    <CardContent className="p-0 bg-slate-950 overflow-auto max-h-[600px]">
                        <pre className="text-[10px] font-mono text-emerald-400 p-6 leading-relaxed">
                            {JSON.stringify(health, null, 2)}
                        </pre>
                    </CardContent>
                )}
            </Card>
        </PageContainer>
    )
}
