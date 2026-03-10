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
} from "@/components/ui/tooltip"

import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SectionState } from "@/components/ui/section-state"
import { useAnalyticsData, useIntentAnalytics, useDailyTrendSummary } from "@/hooks/use-analytics-hooks"
import { SearchBookFunnel, DailyTrendSummary, SnapshotData, AllTimeAnalytics } from "@/types/analytics"
import { formatNumber } from "@/lib/utils"

// Charts config
const CHART_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const
const CHART_MARGIN = { top: 0, right: 60, left: 10, bottom: 0 } as const

type Tab = 'daily' | 'weekly' | 'monthly' | 'all-time'

const TABS: { id: Tab; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all-time', label: 'All Time' },
]

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('daily')

    const { allTime, daily, weekly, monthly } = useAnalyticsData(activeTab)
    const { data: intentRes, isLoading: isLoadingIntent } = useIntentAnalytics()

    // Resolve active snapshot data and loading state based on tab
    const activeSnapshot: SnapshotData | null | undefined =
        activeTab === 'daily' ? daily.data :
        activeTab === 'weekly' ? weekly.data :
        activeTab === 'monthly' ? monthly.data :
        undefined

    const isSnapshotLoading =
        activeTab === 'daily' ? daily.isLoading :
        activeTab === 'weekly' ? weekly.isLoading :
        activeTab === 'monthly' ? monthly.isLoading :
        false

    const summary: AllTimeAnalytics | undefined = allTime.data

    const conversionRate = intentRes?.data?.data?.summary?.overallConversionRate || 0

    const today = new Date().toISOString().split('T')[0]
    const [selectedDay, setSelectedDay] = useState<string>(today)
    const { data: trendRes, isLoading: isTrendLoading, error: trendError, refetch: refetchTrend } = useDailyTrendSummary(selectedDay)

    // Sub-label shown under the section header, varies by tab
    const tabPeriodLabel =
        activeTab === 'daily' ? "Today's snapshot" :
        activeTab === 'weekly' ? "This week's snapshot" :
        activeTab === 'monthly' ? "This month's snapshot" :
        "Lifetime aggregate"

    return (
        <PageContainer>
            <TooltipProvider delayDuration={100}>
                <SectionHeader title="System Analytics" />

                {/* ── Tab Switcher ── */}
                <div className="flex gap-1 mb-8 bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* SECTION 1 — PLATFORM ACTIVITY */}
                <div className="mb-10">
                    <SectionLabel label="Platform Activity" sub={`User engagement & presence — ${tabPeriodLabel}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* DAU / WAU / MAU — field name differs per layer */}
                        <MetricCard
                            title={activeTab === 'daily' ? "DAU" : activeTab === 'weekly' ? "WAU" : activeTab === 'monthly' ? "MAU" : "Total Users"}
                            value={
                                activeTab === 'all-time'
                                    ? (allTime.isLoading ? "..." : formatNumber(summary?.totalUsers || 0))
                                    : (isSnapshotLoading ? "..." : formatNumber(
                                        (activeTab === 'daily' ? activeSnapshot?.dau :
                                         activeTab === 'weekly' ? activeSnapshot?.wau :
                                         activeSnapshot?.mau) || 0
                                    ))
                            }
                            sub={activeTab === 'all-time' ? "Registered Accounts" : "Active Users"}
                            icon={<Users className="w-4 h-4 text-blue-500" />}
                            isLive={activeTab === 'daily'}
                            description="Active users in the selected period."
                        />
                        {activeTab !== 'all-time' && (
                            <MetricCard
                                title="Total Users"
                                value={allTime.isLoading ? "..." : formatNumber(summary?.totalUsers || 0)}
                                sub="Registered Accounts"
                                icon={<Users className="w-4 h-4 text-indigo-500" />}
                                description="Total registered user accounts."
                            />
                        )}
                        <MetricCard
                            title="Retention Rate"
                            value={isSnapshotLoading ? "..." : `${((activeSnapshot?.userRetentionRate || 0) * 100).toFixed(1)}%`}
                            sub="Day-over-Day Stickiness"
                            icon={<Heart className="w-4 h-4 text-rose-500" />}
                            isLive={activeTab === 'daily'}
                            description="% of prior period users who returned."
                        />
                    </div>
                </div>

                {/* SECTION 2 — DEMAND & BOOKINGS */}
                <div className="mb-10">
                    <SectionLabel label="Demand & Bookings" sub={`Marketplace throughput — ${tabPeriodLabel}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Bookings"
                            value={
                                activeTab === 'all-time'
                                    ? (allTime.isLoading ? "..." : formatNumber(summary?.totalBookings || 0))
                                    : (isSnapshotLoading ? "..." : formatNumber(activeSnapshot?.bookings || 0))
                            }
                            sub={activeTab === 'all-time' ? "Lifetime volume" : "Period volume"}
                            icon={<ShoppingBag className="w-4 h-4 text-emerald-500" />}
                            description="Total bookings initiated in the selected period."
                        />
                        <MetricCard
                            title="Completed Bookings"
                            value={
                                activeTab === 'all-time'
                                    ? (allTime.isLoading ? "..." : formatNumber(summary?.totalCompletedBookings || 0))
                                    : (isSnapshotLoading ? "..." : formatNumber(activeSnapshot?.bookings_completed || 0))
                            }
                            sub="Success volume"
                            icon={<ShieldCheck className="w-4 h-4 text-blue-500" />}
                            description="Completed services in the selected period."
                        />
                        <MetricCard
                            title="Searches"
                            value={isSnapshotLoading ? "..." : formatNumber(activeSnapshot?.searches || 0)}
                            sub="Initiated"
                            icon={<Target className="w-4 h-4 text-orange-500" />}
                            isLive={activeTab === 'daily'}
                            description="Total user searches in the selected period."
                        />
                        <MetricCard
                            title="Booking Conversion"
                            value={isLoadingIntent ? "..." : `${(conversionRate * 100).toFixed(1)}%`}
                            sub="Search → Booking"
                            icon={<Target className="w-4 h-4 text-violet-500" />}
                            isLive={true}
                            description="% of sessions with search that resulted in a booking."
                        />
                        <MetricCard
                            title="Reviews"
                            value={isSnapshotLoading ? "..." : formatNumber(activeSnapshot?.reviews_submitted || 0)}
                            sub="Submitted"
                            icon={<Activity className="w-4 h-4 text-emerald-500" />}
                            isLive={activeTab === 'daily'}
                            description="Reviews submitted in the selected period."
                        />
                    </div>
                </div>

                {/* SECTION 3 — SUPPLY HEALTH */}
                <div className="mb-10">
                    <SectionLabel label="Supply Health" sub={`Provider ecosystem metrics — ${tabPeriodLabel}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Total Providers"
                            value={allTime.isLoading ? "..." : formatNumber(summary?.totalProviders || 0)}
                            sub="Supply volume"
                            icon={<Activity className="w-4 h-4 text-indigo-500" />}
                            description="Total registered service providers."
                        />
                        <MetricCard
                            title="Avg Trust Score"
                            value={isSnapshotLoading ? '...' : (activeSnapshot?.avgProviderTrustScore || 0).toFixed(2)}
                            sub="System quality avg"
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            isLive={activeTab === 'daily'}
                            description="Mean trust score across all providers (0-100)."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard
                                title="In Decay"
                                value={isSnapshotLoading ? '...' : formatNumber(activeSnapshot?.providersInDecay || 0)}
                                sub="Trust declining"
                                icon={<Activity className="w-4 h-4 text-rose-500" />}
                                isLive={activeTab === 'daily'}
                                description="Providers whose scores dropped recently."
                            />
                            <MetricCard
                                title="In Recovery"
                                value={isSnapshotLoading ? '...' : formatNumber(activeSnapshot?.providersInRecovery || 0)}
                                sub="Rebuilding"
                                icon={<Activity className="w-4 h-4 text-blue-500" />}
                                isLive={activeTab === 'daily'}
                                description="Providers whose scores are improving."
                            />
                        </div>
                        <MetricCard
                            title="Review Density"
                            value={isSnapshotLoading ? '...' : `${((activeSnapshot?.booking_to_review_ratio || 0) * 100).toFixed(1)}%`}
                            sub="Feedback frequency"
                            icon={<Star className="w-4 h-4 text-amber-500" />}
                            description="% of bookings that receive a review."
                        />
                    </div>
                </div>

                {/* SECTION 4 — TRUST & MODERATION */}
                <div className="mb-10">
                    <SectionLabel label="Trust & Moderation" sub={`Platform integrity & resolution — ${tabPeriodLabel}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Complaints"
                            value={
                                activeTab === 'all-time'
                                    ? (allTime.isLoading ? "..." : formatNumber(summary?.totalComplaints || 0))
                                    : (isSnapshotLoading ? "..." : formatNumber(activeSnapshot?.complaints || 0))
                            }
                            sub={activeTab === 'all-time' ? "Lifetime volume" : "Period volume"}
                            icon={<MessageSquare className="w-4 h-4 text-slate-500" />}
                            description="Total complaints in the selected period."
                        />
                        <MetricCard
                            title="Resolution Rate"
                            value={isSnapshotLoading ? '...' : `${((activeSnapshot?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}
                            sub="Closing efficiency"
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            isLive={activeTab === 'daily'}
                            description="% of complaints marked as resolved."
                        />
                        <MetricCard
                            title="Open Griefs"
                            value={isSnapshotLoading ? '...' : formatNumber(activeSnapshot?.pendingComplaints || 0)}
                            sub="Active backlog"
                            icon={<Clock className="w-4 h-4 text-orange-500" />}
                            isLive={activeTab === 'daily'}
                            description="Current count of unresolved complaints."
                        />
                    </div>
                </div>

                {/* SECTION 5 — USER JOURNEY (snapshot tabs only) */}
                {activeTab !== 'all-time' && (
                    <div className="mb-10">
                        <SectionLabel label="User Journey" sub="Session-level telemetry" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <MetricCard
                                title="Funnel Efficiency"
                                value={isSnapshotLoading ? '...' : `${((activeSnapshot?.searchBookFunnel?.sessionConversionRate || 0) * 100).toFixed(1)}%`}
                                sub="Path conversion"
                                icon={<Target className="w-4 h-4 text-violet-500" />}
                                isLive={activeTab === 'daily'}
                                description="% of all visitor sessions that end in a booking."
                            />
                            <MetricCard
                                title="Avg Session"
                                value={isSnapshotLoading ? '...' : `${((activeSnapshot?.userIntents?.avgSessionDuration || 0) / 1000).toFixed(1)}s`}
                                sub="Time on platform"
                                icon={<Clock className="w-4 h-4 text-slate-500" />}
                                description="Average duration of user sessions."
                            />
                        </div>
                    </div>
                )}

                {/* SECTION 6 — Charts (snapshot tabs only) */}
                {activeTab !== 'all-time' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <SessionFunnelSection funnel={activeSnapshot?.searchBookFunnel} />

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
                )}

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
