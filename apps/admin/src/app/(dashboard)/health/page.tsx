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
    const errorCount = logs.filter((l: any) => l.level === "error").length
    const warningCount = logs.filter((l: any) => l.level === "warning").length
    const criticalCount = logs.filter((l: any) => l.level === "critical").length

    return (
        <PageContainer>
            <SectionHeader
                title="System Health"
                action={
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                        <RefreshCw className="h-4 w-4 animate-spin text-violet-500" />
                        Live Monitoring
                    </div>
                }
            />

            <GridSystem cols={3} className="mb-8">
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Server Uptime</span>
                            <Server className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {health?.server?.uptime ? formatUptime(health.server.uptime) : '—'}
                            </div>
                            <p className="text-sm text-green-600 font-semibold mt-1 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Online
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Database</span>
                            <Database className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className={cn("text-3xl font-black tracking-tight", health?.database?.readyState === 1 ? 'text-slate-900' : 'text-red-600')}>
                                {health?.database?.readyState === 1 ? 'Connected' : 'Disconnected'}
                            </div>
                            <p className="text-sm text-slate-500 font-semibold mt-1">MongoDB Status: {health?.database?.status || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Heap Usage</span>
                            <Activity className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {health?.server?.memoryUsage?.heapUsed ? formatMB(health.server.memoryUsage.heapUsed) : '—'}
                            </div>
                            <p className="text-sm text-slate-500 font-semibold mt-1">
                                of {health?.server?.memoryUsage?.heapTotal ? formatMB(health.server.memoryUsage.heapTotal) : '—'} total
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </GridSystem>

            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-500" />
                    System Diagnostics
                </h3>
            </div>

            <GridSystem cols={3} className="mb-8">
                {/* Runtime Details */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2">Runtime Details</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Platform</span>
                                <span className="font-medium text-slate-900 capitalize">{health?.server?.platform || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Node Version</span>
                                <span className="font-medium text-slate-900">{health?.server?.nodeVersion || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">DB Ready State</span>
                                <span className="font-medium text-slate-900">{health?.database?.readyState ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Process Arch</span>
                                <span className="font-medium text-slate-900">{health?.server?.arch || '—'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Memory Breakdown */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2">Memory Breakdown</h4>
                        <div className="space-y-3 text-sm">
                            {health?.server?.memoryUsage && Object.entries(health.server.memoryUsage).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-medium text-slate-900">{formatMB(val)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Log Summary */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 border-b pb-2">Log Summary</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Critical Issues</span>
                                <span className={cn("font-bold", criticalCount > 0 ? "text-red-600" : "text-slate-900")}>{criticalCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Errors</span>
                                <span className={cn("font-bold", errorCount > 0 ? "text-red-600" : "text-slate-900")}>{errorCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Warnings</span>
                                <span className={cn("font-bold", warningCount > 0 ? "text-amber-600" : "text-slate-900")}>{warningCount}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t">
                                <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tight">Latest Log Message</span>
                                <p className="text-xs text-slate-600 line-clamp-2 italic">
                                    {logs[0]?.message || "No recent logs available"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </GridSystem>

            <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden mb-8">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Advanced Telemetry</h3>
                        <p className="text-xs text-slate-500">Full raw system diagnostic output</p>
                    </div>
                    <button
                        onClick={() => setShowRaw(!showRaw)}
                        className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 transition-colors uppercase tracking-wider"
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
