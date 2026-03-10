"use client"

import React, { useState, useMemo } from "react"
import {
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, BarChart, Bar, LabelList
} from "recharts"
import {
    Users, ShoppingBag, ShieldCheck,
    MessageSquare, Target, Activity,
    Heart, Clock, Info, Star
} from "lucide-react"

import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/admin/ui/tooltip"

import { PageContainer } from "@/components/admin/ui/page-container"
import { SectionHeader } from "@/components/admin/ui/section-header"
import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"
import { SectionState } from "@/components/admin/ui/section-state"
import { useAnalyticsData, useIntentAnalytics, useDailyTrendSummary } from "@/hooks/admin/use-analytics-hooks"
import { SearchBookFunnel, DailyTrendSummary } from "@/types/admin/analytics"
import { formatNumber } from "@/lib/admin/utils"

// Charts config
const CHART_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const
const CHART_MARGIN = { top: 0, right: 60, left: 10, bottom: 0 } as const

export default function AnalyticsPage() {
    const today = new Date().toISOString().split('T')[0]
    const { allTime, daily } = useAnalyticsData(today, "current", "current")
    const { data: intentRes, isLoading: isLoadingIntent } = useIntentAnalytics()

    // Defaulting to daily for active data context
    const activeData = daily.data
    const isLoading = daily.isLoading
    const summary = allTime.data

    const conversionRate = intentRes?.data?.data?.summary?.overallConversionRate || 0

    // Trust trend state
    const [selectedDay, setSelectedDay] = useState<string>(today)
    const { data: trendRes, isLoading: isTrendLoading, error: trendError, refetch: refetchTrend } = useDailyTrendSummary(selectedDay)

    return (
        <PageContainer>
            <TooltipProvider delayDuration={100}>
                <SectionHeader title="System Analytics" />

                {/* SECTION 1 — PLATFORM ACTIVITY */}
                <div className="mb-10">
                    <SectionLabel label="Platform Activity" sub="User engagement & presence" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="DAU"
                            value={isLoading ? "..." : formatNumber(activeData?.dau || 0)}
                            sub="Daily Active Users"
                            icon={<Users className="w-4 h-4 text-blue-500" />}
                            isLive={true}
                            description="Unique users active today. Updated: every 30 mins."
                        />
                        <MetricCard
                            title="Total Users"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalUsers || 0)}
                            sub="Registered Accounts"
                            icon={<Users className="w-4 h-4 text-indigo-500" />}
                            description="Total registered user accounts. Updated: Midnight."
                        />
                        <MetricCard
                            title="Retention Rate"
                            value={isLoading ? "..." : `${((activeData?.userRetentionRate || 0) * 100).toFixed(1)}%`}
                            sub="Day-over-Day Stickiness"
                            icon={<Heart className="w-4 h-4 text-rose-500" />}
                            isLive={true}
                            description="% of yesterday's users who returned today. Updated: Live."
                        />
                    </div>
                </div>

                {/* SECTION 2 — DEMAND & BOOKINGS */}
                <div className="mb-10">
                    <SectionLabel label="Demand & Bookings" sub="Marketplace throughput" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Bookings"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalBookings || 0)}
                            sub="Lifetime volume"
                            icon={<ShoppingBag className="w-4 h-4 text-emerald-500" />}
                            description="Total lifetime bookings initiated. Updated: Midnight."
                        />
                        <MetricCard
                            title="Total Successful"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalCompletedBookings || 0)}
                            sub="Success volume"
                            icon={<ShieldCheck className="w-4 h-4 text-blue-500" />}
                            description="Lifetime total of completed services. Updated: Midnight."
                        />
                        <MetricCard
                            title="Live Searches"
                            value={isLoading ? "..." : formatNumber(activeData?.searches || 0)}
                            sub="Initiated Today"
                            icon={<Target className="w-4 h-4 text-orange-500" />}
                            isLive={true}
                            description="Total user searches initiated today. Updated: Live."
                        />
                        <MetricCard
                            title="Booking Conversion"
                            value={isLoadingIntent ? "..." : `${(conversionRate * 100).toFixed(1)}%`}
                            sub="Search → Booking"
                            icon={<Target className="w-4 h-4 text-violet-500" />}
                            isLive={true}
                            description="% of searches that result in a booking. Updated: Live."
                        />
                        <MetricCard
                            title="Live Bookings"
                            value={isLoading ? "..." : formatNumber(activeData?.bookings || 0)}
                            sub="Initiated Today"
                            icon={<Activity className="w-4 h-4 text-emerald-500" />}
                            isLive={true}
                            description="Total bookings initiated today. Updated: Live."
                        />
                    </div>
                </div>

                {/* SECTION 3 — SUPPLY HEALTH */}
                <div className="mb-10">
                    <SectionLabel label="Supply Health" sub="Provider ecosystem metrics" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Providers"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalProviders || 0)}
                            sub="Supply volume"
                            icon={<Activity className="w-4 h-4 text-indigo-500" />}
                            description="Total registered service providers. Updated: Midnight."
                        />
                        <MetricCard
                            title="Avg Trust Score"
                            value={isLoading ? '...' : (activeData?.avgProviderTrustScore || 0).toFixed(2)}
                            sub="System quality avg"
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            isLive={true}
                            description="Mean trust score across all providers (0-100). Updated: Live."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="In Decay"
                                value={isLoading ? '...' : formatNumber(activeData?.providersInDecay || 0)}
                                sub="Trust declining"
                                icon={<Activity className="w-4 h-4 text-rose-500" />}
                                isLive={true}
                                description="Providers whose scores dropped recently. Updated: Live."
                            />
                            <MetricCard
                                title="In Recovery"
                                value={isLoading ? '...' : formatNumber(activeData?.providersInRecovery || 0)}
                                sub="Rebuilding"
                                icon={<Activity className="w-4 h-4 text-blue-500" />}
                                isLive={true}
                                description="Providers whose scores are improving. Updated: Live."
                            />
                        </div>
                        <MetricCard
                            title="Review Density"
                            value={isLoading ? '...' : `${((activeData?.booking_to_review_ratio || 0) * 100).toFixed(1)}%`}
                            sub="Feedback frequency"
                            icon={<Star className="w-4 h-4 text-amber-500" />}
                            description="% of bookings that receive a review. Updated: Live."
                        />
                    </div>
                </div>

                {/* SECTION 4 — TRUST & MODERATION */}
                <div className="mb-10">
                    <SectionLabel label="Trust & Moderation" sub="Platform integrity & resolution" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Complaints"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalComplaints || 0)}
                            sub="Lifetime volume"
                            icon={<MessageSquare className="w-4 h-4 text-slate-500" />}
                            description="Total lifetime sum of all grievances. Updated: Midnight."
                        />
                        <MetricCard
                            title="Resolution Rate"
                            value={isLoading ? '...' : `${((activeData?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}
                            sub="Closing efficiency"
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            isLive={true}
                            description="% of total complaints marked as resolved. Updated: Live."
                        />
                        <MetricCard
                            title="Open Griefs"
                            value={isLoading ? '...' : formatNumber(activeData?.pendingComplaints || 0)}
                            sub="Active backlog"
                            icon={<Clock className="w-4 h-4 text-orange-500" />}
                            isLive={true}
                            description="Current count of unresolved complaints. Updated: Live."
                        />
                    </div>
                </div>

                {/* SECTION 5 — USER JOURNEY */}
                <div className="mb-10">
                    <SectionLabel label="User Journey" sub="Session-level telemetry" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Funnel Efficiency"
                            value={isLoading ? '...' : `${((activeData?.searchBookFunnel?.sessionConversionRate || 0) * 100).toFixed(1)}%`}
                            sub="Path conversion"
                            icon={<Target className="w-4 h-4 text-violet-500" />}
                            isLive={true}
                            description="% of all visitor sessions that end in a booking. Updated: Live."
                        />
                        <MetricCard
                            title="Avg Session"
                            value={isLoading ? '...' : `${((activeData?.userIntents?.avgSessionDuration || 0) / 1000).toFixed(1)}s`}
                            sub="Time on platform"
                            icon={<Clock className="w-4 h-4 text-slate-500" />}
                            description="Average duration of user sessions. Updated: Midnight."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <SessionFunnelSection funnel={activeData?.searchBookFunnel} />

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Trust Trend</h3>
                            <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
                            <input
                                type="date"
                                value={selectedDay}
                                onChange={e => setSelectedDay(e.target.value)}
                                max={today}
                                className="text-xs font-medium border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <TrustTrendSection trend={trendRes} error={trendError} onRetry={refetchTrend} />
                    </div>
                </div>

            </TooltipProvider>
        </PageContainer>
    )
}

function SectionLabel({ label, sub }: { label: string, sub: string }) {
    return (
        <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">{label}</h3>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{sub}</span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800"></div>
            </div>
        </div>
    )
}

function MetricCard({
    title, value, sub, icon, isLive, description
}: {
    title: string, value: string | number, sub: string, icon: React.ReactNode, isLive?: boolean, description?: string
}) {
    return (
        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group overflow-hidden bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 min-h-[120px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors uppercase">{title}</span>
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

const TrustTrendSection = React.memo(function TrustTrendSection({
    trend,
    error,
    onRetry
}: {
    trend: DailyTrendSummary | null | undefined
    error?: unknown
    onRetry?: () => void
}) {
    const chartData = useMemo(() => {
        if (!trend?.intentBreakdown) return []
        return Object.entries(trend.intentBreakdown)
            .map(([key, value]) => ({
                name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                value: value as number
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)
    }, [trend])

    const loading = trend === undefined && !error;

    return (
        <SectionState
            isLoading={loading}
            error={error}
            isEmpty={!trend || chartData.length === 0}
            emptyMessage="No intent signals or concern trend data for this day"
            onRetry={onRetry}
        >
            <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardContent className="p-5">
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={CHART_MARGIN} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.12)" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} width={110} />
                                <RechartsTooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={CHART_TOOLTIP_STYLE} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                                    <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </SectionState>
    )
})

const SessionFunnelSection = React.memo(function SessionFunnelSection({
    funnel
}: {
    funnel: SearchBookFunnel | undefined
}) {
    const data = useMemo(() => [
        { name: 'Started', value: funnel?.sessionStarted || 0 },
        { name: 'Profile View', value: funnel?.sessionWithProfileView || 0 },
        { name: 'Booking', value: funnel?.sessionWithBooking || 0 }
    ], [funnel])

    return (
        <SectionState isLoading={!funnel} isEmpty={!funnel}>
            <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader className="pb-3 px-6 pt-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 underline decoration-violet-500/30">Session Funnel</span>
                    <div className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums">
                        {((funnel?.sessionConversionRate || 0) * 100).toFixed(1)}% <span className="text-sm font-medium text-slate-400">Conv.</span>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={CHART_MARGIN} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.15)" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={90} />
                                <RechartsTooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={CHART_TOOLTIP_STYLE} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                                    <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </SectionState>
    )
})
