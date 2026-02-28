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

export default function HealthPage() {
    const { data: health, isLoading, isError, error } = useQuery({
        queryKey: ['system-health'],
        queryFn: fetchSystemHealth,
        refetchInterval: 30000 // Refresh every 30 seconds
    }) as { data: any, isLoading: boolean, isError: boolean, error: unknown }

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

            <GridSystem cols={3} className="mb-8">
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Server Uptime</span>
                            <Server className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {health?.server?.uptime ? formatUptime(health.server.uptime) : '—'}
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-500 font-semibold mt-1 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Online
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Database</span>
                            <Database className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className={cn("text-3xl font-black tracking-tight", health?.database?.readyState === 1 ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-500')}>
                                {health?.database?.readyState === 1 ? 'Connected' : 'Disconnected'}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 font-semibold mt-1">MongoDB Status: {health?.database?.status || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Heap Usage</span>
                            <Activity className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {health?.server?.memoryUsage?.heapUsed ? formatMB(health.server.memoryUsage.heapUsed) : '—'}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 font-semibold mt-1">
                                of {health?.server?.memoryUsage?.heapTotal ? formatMB(health.server.memoryUsage.heapTotal) : '—'} total
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </GridSystem>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-500" />
                    System Diagnostics
                </h3>
            </div>

            <GridSystem cols={3} className="mb-8">
                {/* Runtime Details */}
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b dark:border-neutral-800 pb-2">Runtime Details</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-neutral-400">Platform</span>
                                <span className="font-medium text-slate-900 dark:text-white capitalize">{health?.server?.platform || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-neutral-400">DB Ready State</span>
                                <span className="font-medium text-slate-900 dark:text-white">{health?.database?.readyState ?? '—'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Memory Breakdown */}
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b dark:border-neutral-800 pb-2">Memory Breakdown</h4>
                        <div className="space-y-3 text-sm">
                            {health?.server?.memoryUsage && Object.entries(health.server.memoryUsage).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{formatMB(val)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Log Summary */}
                <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b dark:border-neutral-800 pb-2">Log Summary</h4>
                        <div className="space-y-3 text-sm">
                            <div className="pt-2">
                                <span className="text-xs text-slate-400 dark:text-neutral-500 block mb-1 uppercase font-bold tracking-tight">Latest Log Message</span>
                                <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-2 italic">
                                    {logs[0]?.message || "No recent logs available"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </GridSystem>

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
