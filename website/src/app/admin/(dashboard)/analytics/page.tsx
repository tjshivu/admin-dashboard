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
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { SectionState } from "@/components/admin/ui/section-state"
import { useAnalyticsData, useIntentAnalytics, useDailyTrendSummary } from "@/hooks/admin/use-analytics-hooks"
import { SearchBookFunnel, DailyTrendSummary } from "@/types/admin/analytics"
import { formatNumber } from "@/lib/admin/utils"

// Charts config
const CHART_TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 600 } as const
const CHART_MARGIN = { top: 0, right: 60, left: 10, bottom: 0 } as const

export default function AnalyticsPage() {
    const today = new Date().toISOString().split('T')[0]
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('daily')
    const { allTime, daily, weekly, monthly } = useAnalyticsData(timeRange)
    const { data: intentRes, isLoading: isLoadingIntent } = useIntentAnalytics()

    // active Data context depends on selection
    const activeData = useMemo(() => {
        if (timeRange === 'all-time') {
            const sum = allTime.data;
            if (!sum) return null;
            return {
                searches: 0, // Fallback as all-time searches isn't in summary
                bookings: sum.totalBookings,
                bookings_completed: sum.totalCompletedBookings,
                avgProviderTrustScore: 0, // Fallback
                providersInDecay: 0,
                providersInRecovery: 0,
                avgDecayRatio: 0,
                throttledProviders: 0,
                suspendedProviders: sum.suspendedProviders,
                delistedProviders: 0,
                pendingComplaints: 0,
                newUserCount: sum.totalUsers,
                returningUserCount: 0,
                userRetentionRate: 0,
                conversionRate: 0,
            } as any;
        }
        return timeRange === 'daily' ? daily.data : timeRange === 'weekly' ? weekly?.data : monthly?.data
    }, [timeRange, daily.data, weekly?.data, monthly?.data, allTime.data])

    const isLoading = timeRange === 'daily' ? daily.isLoading : timeRange === 'all-time' ? allTime.isLoading : timeRange === 'weekly' ? weekly?.isLoading : monthly?.isLoading
    const summary = allTime.data
    const isLive = timeRange === 'daily'
    const isAllTime = timeRange === 'all-time'

    const conversionRate = intentRes?.data?.data?.summary?.overallConversionRate || 0

    // Trust trend state
    const [selectedDay, setSelectedDay] = useState<string>(today)
    const { data: trendRes, isLoading: isTrendLoading, error: trendError, refetch: refetchTrend } = useDailyTrendSummary(selectedDay)

    return (
        <PageContainer>
            <TooltipProvider delayDuration={100}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <SectionHeader title="System Analytics" />
                    <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'daily' | 'weekly' | 'monthly')} className="w-full sm:w-auto">
                        <TabsList className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-1">
                            <TabsTrigger value="daily" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">Monthly</TabsTrigger>
                            <TabsTrigger value="all-time" className="text-xs px-4 py-1.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300">All-Time</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* SECTION 1 — PLATFORM ACTIVITY */}
                <div className="mb-10">
                    <SectionLabel label="Platform Activity" sub="User engagement & presence" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title={isLive ? "DAU" : isAllTime ? "Total Users" : timeRange === 'weekly' ? "WAU" : "MAU"}
                            value={isLoading ? "..." : formatNumber(
                                isLive ? (activeData?.dau ?? 0)
                                    : isAllTime ? (summary?.totalUsers ?? 0)
                                        : timeRange === 'weekly' ? (activeData?.wau ?? 0)
                                            : (activeData?.mau ?? 0)
                            )}
                            sub={isAllTime ? "Cumulative Active Accounts" : "Active Users"}
                            icon={<Users className="w-4 h-4 text-blue-500" />}
                            isLive={isLive}
                            description={isLive ? "Unique users active today." : isAllTime ? "Total unique user accounts registered." : `Unique active users for this ${timeRange} period.`}
                        />
                        <MetricCard
                            title="Retention Rate"
                            value={isLoading ? "..." : `${((activeData?.userRetentionRate || 0) * 100).toFixed(1)}%`}
                            sub={isLive ? "Day-over-Day Stickiness" : `${timeRange} Stickiness`}
                            icon={<Heart className="w-4 h-4 text-rose-500" />}
                            isLive={isLive}
                            description={isLive ? "% of yesterday's users who returned today." : `% of users retained this ${timeRange} period.`}
                        />
                    </div>
                    {isLive && (
                        <div className="mt-6 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-neutral-800/20 p-4 rounded-xl border border-slate-100 dark:border-neutral-800">
                            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm min-w-[160px] transition-all hover:scale-[1.02]">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        New Users
                                    </span>
                                    <UITooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-400" />
                                        </TooltipTrigger>
                                        <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                            Users who created their account today.
                                        </TooltipContent>
                                    </UITooltip>
                                </div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{isLoading ? "..." : formatNumber(activeData?.newUserCount || 0)}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm min-w-[160px] transition-all hover:scale-[1.02]">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        Returning Users
                                    </span>
                                    <UITooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-400" />
                                        </TooltipTrigger>
                                        <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                            Active users who registered before today.
                                        </TooltipContent>
                                    </UITooltip>
                                </div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{isLoading ? "..." : formatNumber(activeData?.returningUserCount || 0)}</span>
                            </div>
                        </div>
                    )}
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
                            title="Searches"
                            value={isLoading ? "..." : formatNumber(activeData?.searches || 0)}
                            sub={`Initiated ${timeRange}`}
                            icon={<Target className="w-4 h-4 text-orange-500" />}
                            isLive={isLive}
                            description={`Total user searches initiated in this ${timeRange} period.`}
                        />
                        <MetricCard
                            title="Bookings"
                            value={isLoading ? "..." : formatNumber(activeData?.bookings || 0)}
                            sub={`Initiated ${timeRange}`}
                            icon={<Activity className="w-4 h-4 text-emerald-500" />}
                            isLive={isLive}
                            description={isLive ? "Total bookings initiated today (Live)." : `Total bookings initiated in this ${timeRange} period.`}
                        />
                    </div>
                </div>

                {/* SECTION 3 — SUPPLY HEALTH */}
                <div className="mb-10">
                    <SectionLabel label="Supply Health" sub="Provider ecosystem metrics" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Consolidated Card 1: Provider Status */}
                        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">Provider Status</span>
                                    <Activity className="w-4 h-4 text-indigo-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500">Total Providers</span>
                                        <span className="text-lg font-semibold text-slate-900 dark:text-white">{allTime.isLoading ? "..." : formatNumber(summary?.totalProviders || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Verified Providers</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Providers who have completed identity verification.
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{allTime.isLoading ? "..." : formatNumber(summary?.verifiedProviders || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Trusted Providers</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Providers with a trust score above 85.
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{allTime.isLoading ? "..." : formatNumber(summary?.trustedProviders || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800 pt-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Suspended Providers</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Providers restricted due to policy violations.
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{allTime.isLoading ? "..." : formatNumber(summary?.suspendedProviders || 0)}</span>
                                    </div>
                                    {isLive && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-slate-500">Throttled Providers</span>
                                                    <UITooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="w-3 h-3 text-slate-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                            Active providers with restricted visibility.
                                                        </TooltipContent>
                                                    </UITooltip>
                                                </div>
                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{isLoading ? "..." : formatNumber(activeData?.throttledProviders || 0)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-slate-500">Delisted Providers</span>
                                                    <UITooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="w-3 h-3 text-slate-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                            Providers removed from platform searches.
                                                        </TooltipContent>
                                                    </UITooltip>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isLoading ? "..." : formatNumber(activeData?.delistedProviders || 0)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consolidated Card 2: Trust & Quality */}
                        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">Trust & Quality</span>
                                        {isLive && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Avg Provider Trust Score</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Mean trust score across all active providers (0-100).
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                                            {isLoading ? '...' : (activeData?.avgProviderTrustScore || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-rose-600/70 dark:text-rose-400/70 uppercase tracking-tighter">In Decay</span>
                                                <UITooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-2.5 h-2.5 text-rose-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                        Providers whose trust score is currently dropping.
                                                    </TooltipContent>
                                                </UITooltip>
                                            </div>
                                            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{isLoading ? '...' : formatNumber(activeData?.providersInDecay || 0)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-tighter">In Recovery</span>
                                                <UITooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-2.5 h-2.5 text-blue-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                        Providers whose trust score is currently rising.
                                                    </TooltipContent>
                                                </UITooltip>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{isLoading ? '...' : formatNumber(activeData?.providersInRecovery || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Consolidated Card 3: Service & Engagement */}
                        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">Service & Engagement</span>
                                        {isLive && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <Star className="w-4 h-4 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Total Services</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Lifetime total of unique service offerings.
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{allTime.isLoading ? "..." : formatNumber(summary?.totalServices || 0)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-slate-500">Platform Rating</span>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3 h-3 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                    Global mean rating across all services.
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {allTime.isLoading ? "..." : (summary?.platformAverageRating || 0).toFixed(1)}
                                            <span className="text-sm font-medium text-slate-400 ml-1">/ 5</span>
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Review Density</span>
                                                <UITooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-3 h-3 text-violet-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] p-2 bg-slate-900 text-white border-none">
                                                        % of bookings that receive a review.
                                                    </TooltipContent>
                                                </UITooltip>
                                            </div>
                                            <span className="text-lg font-bold text-violet-700 dark:text-violet-300">
                                                {isLoading ? '...' : `${((activeData?.booking_to_review_ratio || 0) * 100).toFixed(1)}%`}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-violet-100 dark:bg-violet-500/20 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-violet-500 transition-all duration-500" 
                                                style={{ width: `${(activeData?.booking_to_review_ratio || 0) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 lg:col-span-2">
                             <CardHeader className="p-6 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">Resolution Performance</span>
                                        {isLive && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 transition-all hover:scale-[1.02]">
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Resolution Rate</span>
                                        <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{isLoading ? '...' : `${((activeData?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50/50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 transition-all hover:scale-[1.02]">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resolution Time</span>
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{isLoading ? '...' : `${(activeData?.complaintResolutionTime || 0).toFixed(1)} h`}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 transition-all hover:scale-[1.02]">
                                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Open Griefs</span>
                                        <span className="text-3xl font-bold text-orange-700 dark:text-orange-300">{isLoading ? '...' : formatNumber(activeData?.pendingComplaints || 0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* SECTION 5 — USER JOURNEY */}
                <div className="mb-10">
                    <SectionLabel label="User Journey" sub="Session-level telemetry" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title="Avg Session"
                            value={isLoading ? '...' : `${((activeData?.userIntents?.avgSessionDuration || 0) / 1000).toFixed(1)}s`}
                            sub="Time on platform"
                            icon={<Clock className="w-4 h-4 text-slate-500" />}
                            description="Average duration of user sessions. Updated: Midnight."
                        />
                        <MetricCard
                            title="Friction Rate"
                            value={isLoading ? '...' : (activeData?.searchBookFunnel?.avgStepsToBooking || 0).toFixed(1)}
                            sub="Avg steps to book"
                            icon={<Activity className="w-4 h-4 text-rose-500" />}
                            description="Average number of interaction steps before a booking is completed."
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
