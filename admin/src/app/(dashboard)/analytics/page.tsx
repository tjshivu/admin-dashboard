"use client"

import React, { useState, useMemo } from "react"
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, LabelList,
    PieChart, Pie, Cell // intent
} from "recharts"
import {
    TrendingUp, Users, ShoppingBag, Star,
    AlertCircle, ShieldCheck, Heart, Trash2,
    FileText, MessageSquare, Target, ShieldAlert
} from "lucide-react"

import { PageContainer } from "@/components/ui/page-container"
import { Button } from "@/components/ui/button"
import { SectionState } from "@/components/ui/section-state"
import { SectionHeader } from "@/components/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GridSystem } from "@/components/ui/grid-system"
import { useAnalyticsData, useIntentAnalytics, useDailyTrendSummary } from "@/hooks/use-analytics-hooks"
import { SearchBookFunnel, UserIntents, DailyTrendSummary } from "@/types/analytics" // types

// static
const FUNNEL_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const
const FUNNEL_CHART_MARGIN = { top: 0, right: 60, left: 8, bottom: 0 } as const

// palette
const CONCERN_PALETTE = [
    { key: 'priceConcern', label: 'Price', color: '#F59E0B' },
    { key: 'reviewConcern', label: 'Review', color: '#8B5CF6' },
    { key: 'availabilityConcern', label: 'Availability', color: '#3B82F6' },
    { key: 'ratingConcern', label: 'Rating', color: '#10B981' },
    { key: 'filterMismatch', label: 'Filter', color: '#F43F5E' },
] as const

// tooltip
const INTENT_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const

// trend
const TREND_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const
const TREND_CHART_MARGIN = { top: 0, right: 60, left: 10, bottom: 0 } as const

// Helper to format numbers
const formatNum = (num: number) => new Intl.NumberFormat('en-US').format(num)

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

    // Default dates for snapshots
    const today = new Date().toISOString().split('T')[0]
    const thisWeek = "current"
    const thisMonth = "current"

    const { allTime, daily, weekly, monthly } = useAnalyticsData(today, thisWeek, thisMonth)
    const { data: intentRes, isLoading: isLoadingIntent } = useIntentAnalytics()

    const activeQuery = period === 'daily' ? daily : period === 'weekly' ? weekly : monthly
    const activeData = activeQuery.data
    const isLoading = activeQuery.isLoading
    const activeError = activeQuery.error
    const activeRefetch = activeQuery.refetch
    const summary = allTime.data

    const conversionRate = intentRes?.data?.data?.summary?.overallConversionRate || 0 // intentRes.data = IntentAnalytics, .data.summary = shape

    // day picker state (defaults to today)
    const [selectedDay, setSelectedDay] = useState<string>(today)

    // trend hook
    const { data: trendRes, isLoading: isTrendLoading, error: trendError, refetch: refetchTrend } = useDailyTrendSummary(selectedDay)

    const chartData = [
        { name: 'Searches', value: activeData?.searches || 0 },
        { name: 'Bookings', value: activeData?.bookings || 0 },
        { name: 'Complaints', value: activeData?.complaints || 0 },
        { name: 'Reviews', value: activeData?.reviews_submitted || 0 }
    ]

    return (
        <PageContainer>
            <SectionHeader title="Advanced Analytics" />

            {/* Strategic Overview Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategic Totals</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800"></div>
                </div>
                <GridSystem cols={4}>
                    <MetricCard
                        title="Users"
                        value={allTime.isLoading ? "..." : formatNum(summary?.totalUsers || 0)}
                        sub="Registered Accounts"
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                    />
                    <MetricCard
                        title="Bookings"
                        value={allTime.isLoading ? "..." : formatNum(summary?.totalBookings || 0)}
                        sub={`${formatNum(summary?.totalCompletedBookings || 0)} Completed`}
                        icon={<ShoppingBag className="w-4 h-4 text-emerald-500" />}
                    />
                    <MetricCard
                        title="Platform Rating"
                        value={allTime.isLoading ? "..." : `${(summary?.platformAverageRating || 0).toFixed(1)}/5`}
                        sub="Community Weighted Avg"
                        icon={<Star className="w-4 h-4 text-amber-500" />}
                    />
                    <MetricCard
                        title="Funnel Conversion"
                        value={isLoadingIntent ? "..." : `${(conversionRate * 100).toFixed(1)}%`}
                        sub="Intent to Booking Rate"
                        icon={<Target className="w-4 h-4 text-violet-500" />}
                    />
                </GridSystem>
            </div>

            {/* Efficiency & Risk Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency & Risk</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800"></div>
                </div>
                <GridSystem cols={4}>
                    <MetricCard
                        title="Completion Rate"
                        value={allTime.isLoading ? "..." : `${((summary?.bookingCompletionRate || 0) * 100).toFixed(1)}%`}
                        sub="Goal vs Attempt"
                        icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                    />
                    <MetricCard
                        title="Cancellation Rate"
                        value={allTime.isLoading ? "..." : `${((summary?.bookingCancellationRate || 0) * 100).toFixed(1)}%`}
                        sub="Risk Indicator"
                        icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
                        trend="danger"
                    />
                    <MetricCard
                        title="Total Complaints"
                        value={allTime.isLoading ? "..." : formatNum(summary?.totalComplaints || 0)}
                        sub="Tickets Logged All-time"
                        icon={<FileText className="w-4 h-4 text-slate-500" />}
                    />
                    <MetricCard
                        title="Total Reviews"
                        value={allTime.isLoading ? "..." : formatNum(summary?.totalReviews || 0)}
                        sub="Verified Feedback"
                        icon={<MessageSquare className="w-4 h-4 text-indigo-500" />}
                    />
                </GridSystem>
            </div>

            {/* Trust & Governance Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    {/* label */}
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trust &amp; Governance</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
                    {isLoading && <span className="text-[10px] font-bold text-slate-400 animate-pulse">SYNCING</span>}
                </div>
                <GridSystem cols={4}>
                    <MetricCard
                        title="Avg Trust Score"
                        value={isLoading ? '...' : (activeData?.avgProviderTrustScore || 0).toFixed(2)}
                        sub="Provider avg (0–100)"
                        icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    />
                    {/* correlation */}
                    <MetricCard
                        title="Trust × Conversion"
                        value={isLoading ? '...' : `${((activeData?.trustToConversionCorrelation || 0) * 100).toFixed(1)}%`}
                        sub="Correlation coefficient"
                        icon={<TrendingUp className="w-4 h-4 text-violet-500" />}
                    />
                    {/* decay */}
                    <MetricCard
                        title="Providers in Decay"
                        value={isLoading ? '...' : formatNum(activeData?.providersInDecay || 0)}
                        sub="Trust declining"
                        icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}
                        trend={activeData && (activeData.providersInDecay || 0) > 0 ? 'danger' : 'default'}
                    />
                    {/* recovery */}
                    <MetricCard
                        title="Providers in Recovery"
                        value={isLoading ? '...' : formatNum(activeData?.providersInRecovery || 0)}
                        sub="Rebuilding trust"
                        icon={<ShieldCheck className="w-4 h-4 text-blue-500" />}
                    />
                </GridSystem>
                {/* enforcement row */}
                <div className="mt-3">
                    <GridSystem cols={3}>
                        <MetricCard
                            title="Throttled"
                            value={isLoading ? '...' : formatNum(activeData?.throttledProviders || 0)}
                            sub="Visibility reduced"
                            icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
                        />
                        {/* suspended */}
                        <MetricCard
                            title="Suspended"
                            value={isLoading ? '...' : formatNum(activeData?.suspendedProviders || 0)}
                            sub="Temp. blocked"
                            icon={<AlertCircle className="w-4 h-4 text-orange-500" />}
                            trend={activeData && (activeData.suspendedProviders || 0) > 0 ? 'warning' : 'default'}
                        />
                        {/* delisted */}
                        <MetricCard
                            title="Delisted"
                            value={isLoading ? '...' : formatNum(activeData?.delistedProviders || 0)}
                            sub="Permanently removed"
                            icon={<Trash2 className="w-4 h-4 text-rose-500" />}
                            trend={activeData && (activeData.delistedProviders || 0) > 0 ? 'danger' : 'default'}
                        />
                    </GridSystem>
                </div>
            </div>

            {/* Complaint Health Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    {/* label */}
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complaint Health</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
                    {isLoading && <span className="text-[10px] font-bold text-slate-400 animate-pulse">SYNCING</span>}
                </div>
                <GridSystem cols={4}>
                    {/* volume */}
                    <MetricCard
                        title="Complaints"
                        value={isLoading ? '...' : formatNum(activeData?.complaints || 0)}
                        sub="Raised this period"
                        icon={<FileText className="w-4 h-4 text-slate-500" />}
                    />
                    {/* resolution rate */}
                    <MetricCard
                        title="Resolution Rate"
                        value={isLoading ? '...' : `${((activeData?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}
                        sub="Closed vs raised"
                        icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                        trend={!isLoading && (activeData?.complaintResolutionRate || 0) < 0.8 ? 'danger' : 'default'}
                    />
                    {/* resolution time */}
                    <MetricCard
                        title="Avg Resolution"
                        value={isLoading ? '...' : `${(activeData?.complaintResolutionTime || 0).toFixed(1)}h`}
                        sub="Hours to close"
                        icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
                    />
                    {/* pending */}
                    <MetricCard
                        title="Pending"
                        value={isLoading ? '...' : formatNum(activeData?.pendingComplaints || 0)}
                        sub="Awaiting resolution"
                        icon={<AlertCircle className="w-4 h-4 text-orange-500" />}
                        trend={!isLoading && (activeData?.pendingComplaints || 0) > 0 ? 'warning' : 'default'}
                    />
                </GridSystem>
            </div>

            {/* funnel */}
            <SessionFunnelSection funnel={activeData?.searchBookFunnel} error={activeError} onRetry={activeRefetch as () => void} />

            {/* intent */}
            <UserIntentSection intents={activeData?.userIntents} error={activeError} onRetry={activeRefetch as () => void} />

            {/* trend — date picker stays in parent */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {/* label */}
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Daily Trend</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
                    {/* picker */}
                    <input
                        type="date"
                        value={selectedDay}
                        onChange={e => setSelectedDay(e.target.value)}
                        className="text-xs font-medium border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {isTrendLoading && <span className="text-[10px] font-bold text-slate-400 animate-pulse">SYNCING</span>}
                </div>
                {/* section */}
                <PlatformDailyTrendSection trend={trendRes} error={trendError} onRetry={refetchTrend as () => void} />
            </div>

            {/* Performance Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-violet-500" />
                            Activity Visualization
                        </CardTitle>
                        <div className="flex gap-1 bg-slate-100 dark:bg-neutral-900 p-1 rounded-lg">
                            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all ${period === p
                                        ? 'bg-white dark:bg-neutral-800 text-violet-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-2">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center text-slate-400 animate-pulse text-xs font-medium">
                                    SYNCHRONIZING ANALYTICS STREAMS...
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 }}
                                            cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                                        />
                                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={45} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>


                <div className="space-y-8">

                    {/* Operational Health Card */}
                    <Card className="shadow-sm border-slate-200 dark:border-neutral-800 h-fit">
                        <CardHeader>
                            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Support Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-0">
                            <div className="flex justify-between items-end">
                                <HealthStat
                                    label="Resolution Rate"
                                    value={`${((activeData?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}
                                    desc="Closing period"
                                />
                                <HealthStat
                                    label="Avg. Speed"
                                    value={`${(activeData?.complaintResolutionTime || 0).toFixed(1)}h`}
                                    desc="Response time"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    )
}

function MetricCard({
    title, value, sub, icon, trend = "default"
}: {
    title: string, value: string | number, sub: string, icon: React.ReactNode, trend?: "default" | "danger" | "warning"
}) {
    // color
    const valueColor = trend === 'danger'
        ? 'text-rose-600 dark:text-rose-500'
        : trend === 'warning'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-900 dark:text-white'
    return (
        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group overflow-hidden bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">{title}</span>
                    <div className="p-2 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">{icon}</div>
                </div>
                <div className={`text-2xl font-black mb-1 tracking-tight transition-transform group-hover:translate-x-1 ${valueColor}`}>
                    {value}
                </div>
                <p className="text-[11px] font-medium text-slate-500">{sub}</p>
            </CardContent>
        </Card>
    )
}

// daily
const PlatformDailyTrendSection = React.memo(function PlatformDailyTrendSection({
    trend,
    error,
    onRetry
}: {
    trend: DailyTrendSummary | undefined
    error?: unknown
    onRetry?: () => void
}) {
    // breakdown
    const breakdownChartData = useMemo(() => {
        if (!trend?.intentBreakdown) return []
        return Object.entries(trend.intentBreakdown)
            .map(([key, value]) => ({
                name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                value: value as number
            }))
            .sort((a, b) => b.value - a.value) // sorted
    }, [trend])

    // guard
    // guard
    const noBreakdown = !trend?.intentBreakdown || Object.values(trend.intentBreakdown).every(v => v === 0)

    return (
        <SectionState
            isLoading={!trend}
            error={error}
            isEmpty={!trend || noBreakdown}
            emptyMessage="No intent data for this day"
            onRetry={onRetry}
        >
            {/* KPI row */}
            <GridSystem cols={4}>
                <MetricCard
                    title="Providers Analyzed"
                    value={formatNum(trend?.providersAnalyzed || 0)}
                    sub="With intent data"
                    icon={<Users className="w-4 h-4 text-blue-500" />}
                />
                {/* intents */}
                <MetricCard
                    title="Total Intents"
                    value={formatNum(trend?.totalIntents || 0)}
                    sub="Platform-wide signals"
                    icon={<Target className="w-4 h-4 text-violet-500" />}
                />
                <MetricCard
                    title="Avg per Provider"
                    value={trend?.averageIntentsPerProvider || '0'}
                    sub="Intent density"
                    icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                />
                {/* severity */}
                <MetricCard
                    title="High Severity"
                    value={formatNum(trend?.highSeverityProvidersCount || 0)}
                    sub="Providers flagged"
                    icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
                    trend={(trend?.highSeverityProvidersCount || 0) > 0 ? 'danger' : 'default'}
                />
            </GridSystem>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

                {/* chart */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardContent className="p-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Intent Breakdown</span>
                        {/* chart */}
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={breakdownChartData} layout="vertical" margin={TREND_CHART_MARGIN} barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.12)" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} width={110} />
                                    {/* tooltip */}
                                    <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={TREND_TOOLTIP_STYLE} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                                        {/* counts */}
                                        <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* insights */}
                <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardContent className="p-5 space-y-5">

                        {/* concerns */}
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Top Concerns</span>
                            {(trend?.topConcerns || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">None reported</p>
                            ) : (
                                <div className="space-y-2">
                                    {trend?.topConcerns?.slice(0, 3).map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-lg px-3 py-1.5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 dark:text-neutral-200">{c.concern.replace(/_/g, ' ')}</span>
                                                {/* provider */}
                                                <span className="text-slate-400 text-[10px] truncate">{c.provider}</span>
                                            </div>
                                            <span className="font-black text-violet-600 dark:text-violet-400 ml-2 shrink-0">×{c.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* insights */}
                        <div className="border-t border-slate-100 dark:border-neutral-800 pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">System Insights</span>
                            {(trend?.systemInsights || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No insights generated</p>
                            ) : (
                                <ul className="space-y-2">
                                    {trend?.systemInsights?.map((insight, i) => (
                                        <li key={i} className="flex gap-2 text-[11px] text-slate-600 dark:text-neutral-300">
                                            {/* bullet */}
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </CardContent>
                </Card>

            </div>
        </SectionState>
    )
})

// intent
const UserIntentSection = React.memo(function UserIntentSection({
    intents,
    error,
    onRetry
}: {
    intents: UserIntents | undefined
    error?: unknown
    onRetry?: () => void
}) {
    // filtered
    const concernData = useMemo(() =>
        CONCERN_PALETTE
            .map(c => ({ name: c.label, value: (intents as Record<string, number> | undefined)?.[c.key] ?? 0, color: c.color }))
            .filter(c => c.value > 0),
        [intents]
    )

    // guard
    const noData = !intents || concernData.length === 0

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                {/* label */}
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">User Intent Breakdown</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
            </div>

            <SectionState
                isLoading={!intents}
                error={error}
                isEmpty={noData}
                emptyMessage="No concern signals this period"
                onRetry={onRetry}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* donut */}
                    <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <CardContent className="p-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Concern Distribution</span>
                            {/* chart */}
                            <div className="flex items-center gap-6">
                                <div className="h-[180px] w-[180px] shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={concernData}
                                                cx="50%" cy="50%"
                                                innerRadius={52} outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {concernData.map((entry, i) => (
                                                    <Cell key={`c-${i}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            {/* tooltip */}
                                            <Tooltip contentStyle={INTENT_TOOLTIP_STYLE} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* legend */}
                                <div className="flex flex-col gap-2">
                                    {concernData.map(c => (
                                        <div key={c.name} className="flex items-center gap-2 text-xs">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                                            <span className="text-slate-500 dark:text-neutral-400">{c.name}</span>
                                            <span className="ml-auto font-black text-slate-800 dark:text-white tabular-nums">{c.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* kpis */}
                    <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <CardContent className="p-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Session Signals</span>
                            <div className="space-y-4">
                                <IntentStat label="Total Sessions" value={formatNum(intents?.totalSessions || 0)} />
                                {/* duration */}
                                <IntentStat label="Avg Session Duration" value={`${((intents?.avgSessionDuration || 0) / 1000).toFixed(1)}s`} />
                                <IntentStat label="Searches Initiated" value={formatNum(intents?.searchInitiated || 0)} />
                                {/* bookings */}
                                <IntentStat label="Bookings Initiated" value={formatNum(intents?.bookingInitiated || 0)} />
                                <IntentStat label="Search → Profile Rate" value={`${((intents?.searchToProfileViewRatio || 0) * 100).toFixed(1)}%`} />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </SectionState>
        </div>
    )
})

// funnel
const SessionFunnelSection = React.memo(function SessionFunnelSection({
    funnel,
    error,
    onRetry
}: {
    funnel: SearchBookFunnel | undefined
    error?: unknown
    onRetry?: () => void
}) {
    // chart data
    const funnelChartData = useMemo(() => [
        { name: 'Started', value: funnel?.sessionStarted || 0 },
        { name: 'Profile View', value: funnel?.sessionWithProfileView || 0 },
        { name: 'Booking', value: funnel?.sessionWithBooking || 0 }
    ], [funnel])

    // drop-off
    const started = funnel?.sessionStarted || 0
    const profiled = funnel?.sessionWithProfileView || 0
    const booked = funnel?.sessionWithBooking || 0
    const searchToProfile = started > 0 ? ((profiled / started) * 100).toFixed(1) : '—'
    const profileToBooking = profiled > 0 ? ((booked / profiled) * 100).toFixed(1) : '—'

    // guard
    const noData = !funnel

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                {/* label */}
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session Funnel</h3>
                <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
            </div>

            <SectionState
                isLoading={!funnel}
                error={error}
                isEmpty={noData}
                onRetry={onRetry}
            >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* conversion KPI */}
                    <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-center">
                        <CardContent className="p-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                                Session Conversion
                            </span>
                            {/* rate */}
                            <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                                {noData ? '...' : `${((funnel?.sessionConversionRate || 0) * 100).toFixed(1)}%`}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                                Avg steps: <span className="font-black text-slate-600 dark:text-neutral-300">
                                    {noData ? '…' : (funnel?.avgStepsToBooking || 0).toFixed(1)}
                                </span>
                            </p>
                            {/* drop-offs */}
                            <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-neutral-800 pt-4">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Search → Profile</span>
                                    <span className="font-black text-slate-700 dark:text-neutral-200">{searchToProfile}%</span>
                                </div>
                                {/* step */}
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Profile → Booking</span>
                                    <span className="font-black text-slate-700 dark:text-neutral-200">{profileToBooking}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* chart */}
                    <Card className="lg:col-span-3 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <CardContent className="p-5">
                            <div className="h-[180px] w-full">
                                {noData ? (
                                    <div className="h-full flex items-center justify-center text-slate-400 animate-pulse text-xs font-medium">
                                        LOADING...
                                    </div>
                                ) : (
                                    // chart
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={funnelChartData}
                                            layout="vertical"
                                            margin={FUNNEL_CHART_MARGIN}
                                            barSize={28}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.15)" />
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={90} />
                                            <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} contentStyle={FUNNEL_TOOLTIP_STYLE} />
                                            <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                                                {/* counts */}
                                                <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SectionState>
        </div>
    )
})

function LifecycleRow({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${color} group-hover:scale-125 transition-transform`} />
                <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">{formatNum(count)}</span>
        </div>
    )
}

function HealthStat({ label, value, desc }: { label: string, value: string, desc: string }) {
    return (
        <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{label}</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">{value}</div>
            <p className="text-[10px] font-medium text-slate-500">{desc}</p>
        </div>
    )
}

// stat
function IntentStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">{label}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{value}</span>
        </div>
    )
}
