"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Users, ShoppingBag, Star,
    Heart, Target, Activity, TrendingUp, ShieldCheck, Info, Calendar
} from "lucide-react"
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/admin/ui/tooltip"
import {
    BarChart, Bar, Cell, Tooltip, ResponsiveContainer,
    XAxis, YAxis, CartesianGrid,
    Area, AreaChart,
} from "recharts"

import { PageContainer } from "@/components/admin/ui/page-container"
import { SectionHeader } from "@/components/admin/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import {
    useDashboardSnapshots,
    useIntentAnalytics,
    useLiveProvidersCount
} from "@/hooks/admin/use-analytics-hooks"
import { useLiveAnalytics } from "@/hooks/admin/use-live-analytics"
import { formatNumber } from "@/lib/admin/utils"

// ─── Custom Tooltip for Charts ───────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
    active?: boolean
    payload?: { name: string; value: number; color: string }[]
    label?: string
}) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg px-3 py-2 text-xs">
            {label && <p className="font-semibold text-slate-500 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: <span className="tabular-nums">{typeof p.value === "number" && p.value < 1 ? `${(p.value * 100).toFixed(1)}%` : formatNumber(p.value)}</span>
                </p>
            ))}
        </div>
    )
}

// ─── Live Badge ───────────────────────────────────────────────────────────────

function LiveBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
        </span>
    )
}

// ─── Section Label ────────────────────────────────────────────────────────────

function MetricGroupLabel({ label, sub, badge }: { label: string; sub: string; badge?: React.ReactNode }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{label}</h3>
                {badge}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{sub}</span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
            </div>
        </div>
    )
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
    title, value, sub, icon, isLive, onClick, description
}: {
    title: string; value: string | number; sub: string; icon: React.ReactNode; isLive?: boolean; onClick?: () => void; description?: string
}) {
    return (
        <Card onClick={onClick} className={`hover:border-violet-300 dark:hover:border-violet-600 transition-all group overflow-hidden bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 min-h-[120px] ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}`}>
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">{title}</span>
                            {isLive && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            )}
                            {description && (
                                <UITooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className="text-slate-400 hover:text-violet-600 transition-colors p-1 -m-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Info className="w-3.5 h-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="max-w-[220px] text-[11px] leading-relaxed p-2 bg-slate-900 dark:bg-neutral-800 text-white border-slate-800 shadow-xl z-[100]"
                                    >
                                        {description}
                                    </TooltipContent>
                                </UITooltip>
                            )}
                        </div>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center py-2">
                    <div className="text-3xl font-semibold tracking-tight transition-transform group-hover:translate-x-1 text-slate-900 dark:text-white tabular-nums">
                        {value}
                    </div>
                </div>
                <p className="text-[11px] font-medium text-slate-500">{sub}</p>
            </CardContent>
        </Card>
    )
}

// ─── Today's Activity Bar Chart ───────────────────────────────────────────────

function TodayActivityChart({ isLoading, data }: {
    isLoading: boolean
    data: { searches: number; bookings: number; bookings_completed: number; reviews_submitted: number } | undefined
}) {
    const chartData = [
        { name: "Searches", value: data?.searches ?? 0, fill: "#818cf8" },
        { name: "Bookings", value: data?.bookings ?? 0, fill: "#34d399" },
        { name: "Completed", value: data?.bookings_completed ?? 0, fill: "#10b981" },
        { name: "Reviews", value: data?.reviews_submitted ?? 0, fill: "#f59e0b" },
    ]

    return (
        <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Today's Activity</CardTitle>
                    <p className="text-[11px] text-slate-500 mt-1">Searches → Bookings → Reviews</p>
                </div>
                <LiveBadge />
            </CardHeader>
            <CardContent className="px-2 pb-4 pt-2">
                {isLoading ? (
                    <div className="h-[200px] flex items-center justify-center">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 bg-slate-100 dark:bg-neutral-800 rounded animate-pulse" style={{ height: `${40 + i * 20}px`, alignSelf: 'flex-end' }} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => formatNumber(v)}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                            <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
                <div className="flex gap-4 px-4 mt-2 flex-wrap">
                    {chartData.map(d => (
                        <div key={d.name} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.fill }} />
                            <span className="text-[10px] font-semibold text-slate-500">{d.name}</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white tabular-nums">
                                {isLoading ? "…" : formatNumber(d.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// ─── 7-Day Conversion Trend ───────────────────────────────────────────────────

function ConversionTrendChart({ isLoading, breakdown }: {
    isLoading: boolean
    breakdown?: { day: string; sessionStarted: number; sessionWithBooking: number; conversionRate: number }[]
}) {
    const chartData = (breakdown ?? []).map(d => ({
        day: d.day?.slice(5) ?? "",           // "MM-DD" format
        sessions: d.sessionStarted,
        converted: d.sessionWithBooking,
        rate: d.conversionRate,
    }))

    const hasData = chartData.length > 0

    return (
        <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">7-Day Conversion Trend</CardTitle>
                    <p className="text-[11px] text-slate-500 mt-1">Sessions started vs. sessions with bookings</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                    <TrendingUp className="w-3.5 h-3.5" />
                    7 Days
                </div>
            </CardHeader>
            <CardContent className="px-2 pb-4 pt-2">
                {isLoading ? (
                    <div className="h-[200px] flex items-end gap-2 px-4">
                        {[60, 80, 55, 90, 70, 100, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-100 dark:bg-neutral-800 rounded-t animate-pulse" style={{ height: `${h}px` }} />
                        ))}
                    </div>
                ) : !hasData ? (
                    <div className="h-[200px] flex items-center justify-center">
                        <p className="text-xs text-slate-400">No conversion data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradConverted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => formatNumber(v)}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(148,163,184,0.2)', strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="sessions"
                                name="Sessions Started"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fill="url(#gradSessions)"
                                dot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }}
                                activeDot={{ r: 5 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="converted"
                                name="Converted"
                                stroke="#34d399"
                                strokeWidth={2}
                                fill="url(#gradConverted)"
                                dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
                <div className="flex gap-4 px-4 mt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 rounded-full bg-indigo-400" />
                        <span className="text-[10px] font-semibold text-slate-500">Sessions Started</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-semibold text-slate-500">Converted to Booking</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter()
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily')

    const { data: liveProvidersCount, isLoading: isLoadingProviders } = useLiveProvidersCount()
    const { data: liveData, isLoading: isLoadingLive } = useLiveAnalytics()
    const { activeSnapshot, isLoading: isLoadingSnapshot } = useDashboardSnapshots(true, timeRange)
    const { data: intentRes, isLoading: isLoadingIntent } = useIntentAnalytics()

    const conversionRate = intentRes?.data?.data?.summary?.overallConversionRate ?? 0
    const dailyBreakdown = intentRes?.data?.data?.dailyBreakdown

    const isLive = timeRange === 'daily'
    const isLoadingMetrics = isLive ? isLoadingLive : isLoadingSnapshot
    const activeUsers = isLive ? liveData?.dau : (timeRange === 'weekly' ? (activeSnapshot?.wau ?? 0) : (activeSnapshot?.mau ?? 0))
    const activeSearches = isLive ? liveData?.searches : (activeSnapshot?.searches ?? 0)
    const activeBookings = isLive ? liveData?.bookings : (activeSnapshot?.bookings ?? 0)
    const activeRetention = isLive ? liveData?.userRetentionRate : (activeSnapshot?.userRetentionRate ?? 0)

    return (
        <PageContainer>
            <TooltipProvider delayDuration={100}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <SectionHeader title="System Overview" />
                    <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'daily' | 'weekly' | 'monthly')} className="w-full sm:w-auto">
                        <TabsList className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-1">
                            <TabsTrigger value="daily" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Monthly</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* ── Section 1: Key Platform Metrics ── */}
                <div className="mb-10">
                    <MetricGroupLabel
                        label="Key Platform Metrics"
                        sub={isLive ? "Core performance indicators (Live)" : `Core performance indicators (${timeRange})`}
                        badge={isLive ? <LiveBadge /> : <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 uppercase tracking-widest bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800"><Calendar className="w-3 h-3" /> Historical</div>}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title={isLive ? "DAU" : timeRange === 'weekly' ? "WAU" : "MAU"}
                            value={isLoadingMetrics ? "..." : formatNumber(activeUsers ?? 0)}
                            sub="Active Users"
                            icon={<Users className="w-4 h-4 text-blue-500" />}
                            isLive={isLive}
                            description={isLive ? "Logged-in users active today." : `Active users for this ${timeRange} period.`}
                        />
                        <MetricCard
                            title="Live Providers"
                            value={isLoadingProviders ? "..." : formatNumber(liveProvidersCount ?? 0)}
                            sub="Active Supply"
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            isLive={true}
                            description="Active, searchable supply currently on the platform."
                        />
                        <MetricCard
                            title="Conversion Rate"
                            value={isLoadingIntent ? "..." : `${((isLive ? conversionRate : (activeSnapshot?.conversionRate ?? 0)) * 100).toFixed(1)}%`}
                            sub="Search → Booking"
                            icon={<Target className="w-4 h-4 text-violet-500" />}
                            isLive={isLive}
                            description="Sessions with search that resulted in a booking."
                        />
                        <MetricCard
                            title="Repeat Users"
                            value={isLoadingMetrics ? "..." : `${((activeRetention ?? 0) * 100).toFixed(1)}%`}
                            sub="Returning User Rate"
                            icon={<Heart className="w-4 h-4 text-rose-500" />}
                            isLive={isLive}
                            description="Returning users as a % of total actives."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                        <MetricCard
                            title="Searches"
                            value={isLoadingMetrics ? "..." : formatNumber(activeSearches ?? 0)}
                            sub={`Initiated ${timeRange}`}
                            icon={<Target className="w-4 h-4 text-orange-500" />}
                            isLive={isLive}
                            description={`Total user searches initiated in this ${timeRange} period.`}
                        />
                        <MetricCard
                            title="Bookings"
                            value={isLoadingMetrics ? "..." : formatNumber(activeBookings ?? 0)}
                            sub={`Initiated ${timeRange}`}
                            icon={<ShoppingBag className="w-4 h-4 text-emerald-500" />}
                            isLive={isLive}
                            description={`Bookings initiated in this ${timeRange} period.`}
                        />
                    </div>
                </div>

                {/* ── Section 2 & 3: Live Charts (2-col grid) ── */}
                <div className="mb-10">
                    <MetricGroupLabel
                        label="Live Activity & Trends"
                        sub="Real-time data — auto-refreshes every 10 minutes"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TodayActivityChart
                            isLoading={isLoadingLive}
                            data={liveData}
                        />
                        <ConversionTrendChart
                            isLoading={isLoadingIntent}
                            breakdown={dailyBreakdown}
                        />
                    </div>
                </div>
            </TooltipProvider>
        </PageContainer>
    )
}
