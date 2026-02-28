"use client"

import { useState } from "react"
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from "recharts"
import {
    TrendingUp, Users, ShoppingBag, Star,
    AlertCircle, ShieldCheck, Heart, Trash2,
    FileText, MessageSquare, Target
} from "lucide-react"

import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GridSystem } from "@/components/ui/grid-system"
import { useAnalyticsData, useIntentAnalytics } from "@/hooks/use-analytics-hooks"

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

    const activeData = period === 'daily' ? daily.data : period === 'weekly' ? weekly.data : monthly.data
    const isLoading = period === 'daily' ? daily.isLoading : period === 'weekly' ? weekly.isLoading : monthly.isLoading
    const summary = allTime.data

    const conversionRate = intentRes?.data?.summary?.overallConversionRate || 0

    const chartData = [
        { name: 'Searches', value: activeData?.searches || 0 },
        { name: 'Bookings', value: activeData?.bookings || 0 },
        { name: 'Complaints', value: activeData?.complaints || 0 },
        { name: 'Reviews', value: activeData?.reviews || activeData?.reviews_submitted || 0 }
    ]

    return (
        <PageContainer>
            <SectionHeader
                title="Advanced Analytics"
                description="Comprehensive platform performance and operational metrics"
            />

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
    title: string, value: string | number, sub: string, icon: React.ReactNode, trend?: "default" | "danger"
}) {
    return (
        <Card className="hover:border-violet-300 dark:hover:border-violet-600 transition-all group overflow-hidden bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">{title}</span>
                    <div className="p-2 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">{icon}</div>
                </div>
                <div className={`text-2xl font-black mb-1 tracking-tight transition-transform group-hover:translate-x-1 ${trend === 'danger' ? 'text-rose-600 dark:text-rose-500' : 'text-slate-900 dark:text-white'
                    }`}>
                    {value}
                </div>
                <p className="text-[11px] font-medium text-slate-500">{sub}</p>
            </CardContent>
        </Card>
    )
}

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
