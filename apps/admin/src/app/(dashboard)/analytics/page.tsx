/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchAllTimeAnalytics, fetchDailyAnalytics, fetchWeeklyAnalytics, fetchMonthlyAnalytics } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { GridSystem } from "@/components/ui/grid-system"
import { Users, Activity, BookCheck, ClipboardCheck, MessageSquareWarning, BarChart as BarChartIcon } from "lucide-react"
import { RefreshCw } from "lucide-react"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart } from 'recharts'

function fmtPct(num: any) {
    if (num === undefined || num === null || Number.isNaN(Number(num))) return '—'
    return (num * 100).toFixed(1) + '%'
}

function getCurrentWeekStr() {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`
}

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState("daily")

    const [selectedDay, setSelectedDay] = useState(() => new Date().toISOString().split('T')[0])
    const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekStr)
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))

    const { data: allTimeData, isLoading: allTimeLoading, error: allTimeError } = useQuery({
        queryKey: ['all-time'],
        queryFn: fetchAllTimeAnalytics,
        retry: false,
        refetchOnWindowFocus: false
    }) as { data: any, isLoading: boolean, error: any }

    const { data: dailyData, isLoading: dailyLoading, error: dailyError, isFetching: isDailyFetching } = useQuery({
        queryKey: ['daily-snapshot', selectedDay],
        queryFn: () => fetchDailyAnalytics(selectedDay),
        retry: false,
        refetchOnWindowFocus: false
    }) as { data: any, isLoading: boolean, error: any, isFetching: boolean }

    const { data: weeklyData, isLoading: weeklyLoading, error: weeklyError, isFetching: isWeeklyFetching } = useQuery({
        queryKey: ['weekly-snapshot', selectedWeek],
        queryFn: () => fetchWeeklyAnalytics(selectedWeek),
        retry: false,
        refetchOnWindowFocus: false
    }) as { data: any, isLoading: boolean, error: any, isFetching: boolean }

    const { data: monthlyData, isLoading: monthlyLoading, error: monthlyError, isFetching: isMonthlyFetching } = useQuery({
        queryKey: ['monthly-snapshot', selectedMonth],
        queryFn: () => fetchMonthlyAnalytics(selectedMonth),
        retry: false,
        refetchOnWindowFocus: false
    }) as { data: any, isLoading: boolean, error: any, isFetching: boolean }

    const renderSnapshot = (data: any, isLoading: boolean, isFetching: boolean, error: any, periodLabel: string) => {
        if (isLoading || isFetching) {
            return <div className="flex bg-slate-50 border border-slate-200 rounded-xl h-[400px] justify-center items-center py-20"><RefreshCw className="animate-spin h-8 w-8 text-violet-500 opacity-80" /></div>
        }

        // Handle 404 (No snapshot) or general missing data
        const isNotFound = error?.message?.includes("404") || error?.message?.includes("not found") || (!data && error);

        if (isNotFound || !data) {
            const is500 = error && !isNotFound;
            return (
                <div className="flex flex-col h-[400px] justify-center items-center py-20 bg-slate-50 border border-slate-200 rounded-xl text-center px-6">
                    {is500 ? (
                        <>
                            <span className="text-slate-600 font-semibold mb-1">Unable to retrieve analytics.</span>
                            <p className="text-slate-400 text-sm">Please try refreshing the page or check back later.</p>
                        </>
                    ) : (
                        <>
                            <span className="text-slate-500 font-medium mb-1">No analytics snapshot available for selected period.</span>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                Snapshots are generated at midnight UTC. If no data appears, it might be due to a missing processing cycle.
                            </p>
                        </>
                    )}
                </div>
            )
        }

        const barData = [
            { name: 'Searches', value: data.searches || 0 },
            { name: 'Bookings', value: data.bookings || 0 },
            { name: 'Reviews', value: data.reviews_submitted || data.reviews || 0 },
            { name: 'Complaints', value: data.complaints || 0 }
        ]

        return (
            <div className="space-y-8 mt-6">
                <GridSystem cols={4} className="gap-6">
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3">Searches</div>
                        <div className="text-3xl font-bold text-violet-700">{data.searches || 0}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">Bookings</div>
                        <div className="text-3xl font-bold text-emerald-700">{data.bookings || 0}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">Reviews</div>
                        <div className="text-3xl font-bold text-amber-700">{data.reviews_submitted || data.reviews || 0}</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-3">Complaints</div>
                        <div className="text-3xl font-bold text-red-700">{data.complaints || 0}</div>
                    </div>
                </GridSystem>

                <Card className="rounded-xl shadow-sm border p-6 bg-white">
                    <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-100 mb-6">
                        <CardTitle className="text-base font-bold text-slate-800 uppercase tracking-wider">{periodLabel} Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={60}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <PageContainer>
            <SectionHeader title="Analytics" />

            {allTimeLoading ? (
                <div className="flex justify-center items-center py-10"><RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" /></div>
            ) : (
                <div className="mt-8 mb-8">
                    {allTimeError && (
                        <div className="mb-4 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md inline-flex items-center gap-2">
                            <Activity className="h-3 w-3" />
                            Some all-time metrics may be unavailable until the next processing cycle.
                        </div>
                    )}
                    <GridSystem cols={4} className="gap-6">
                        <StatCard title="Total Users" value={allTimeData?.totalUsers} icon={Users} />
                        <StatCard title="Total Providers" value={allTimeData?.totalProviders} icon={Users} />
                        <StatCard title="Total Bookings" value={allTimeData?.totalBookings} icon={BookCheck} />
                        <StatCard title="Total Completed" value={allTimeData?.totalCompletedBookings} icon={ClipboardCheck} />
                        <StatCard title="Total Reviews" value={allTimeData?.totalReviews} icon={MessageSquareWarning} />
                        <StatCard title="Total Complaints" value={allTimeData?.totalComplaints} icon={MessageSquareWarning} />
                        <StatCard title="Platform Rating" value={allTimeData?.platformAverageRating ? (allTimeData.platformAverageRating).toFixed(1) + ' ★' : '—'} icon={Activity} />
                        <StatCard title="Completion Rate" value={fmtPct(allTimeData?.bookingCompletionRate)} icon={BarChartIcon} />
                        <StatCard title="Cancellation Rate" value={fmtPct(allTimeData?.bookingCancellationRate)} icon={BarChartIcon} />
                        <StatCard title="Provider Activation Rate" value={fmtPct(allTimeData?.providerActivationRate)} icon={BarChartIcon} />
                        <StatCard title="Repeat User Percentage" value={fmtPct(allTimeData?.repeatUserPercentage)} icon={BarChartIcon} />
                    </GridSystem>
                </div>
            )}

            <div className="mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="daily">Daily Snapshot</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly Snapshot</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly Snapshot</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daily">
                        <Card className="rounded-xl border shadow-sm p-6">
                            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Daily Snapshot</CardTitle>
                                <input
                                    type="date"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="border border-slate-200 bg-white rounded-md px-3 py-1.5 text-sm shadow-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                {renderSnapshot(dailyData, dailyLoading, isDailyFetching, dailyError, "Daily")}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="weekly">
                        <Card className="rounded-xl border shadow-sm p-6">
                            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Weekly Snapshot</CardTitle>
                                <input
                                    type="date"
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                    className="border border-slate-200 bg-white rounded-md px-3 py-1.5 text-sm shadow-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                {renderSnapshot(weeklyData, weeklyLoading, isWeeklyFetching, weeklyError, "Weekly")}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monthly">
                        <Card className="rounded-xl border shadow-sm p-6">
                            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Monthly Snapshot</CardTitle>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="border border-slate-200 bg-white rounded-md px-3 py-1.5 text-sm shadow-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                {renderSnapshot(monthlyData, monthlyLoading, isMonthlyFetching, monthlyError, "Monthly")}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    )
}

function StatCard({ title, value, icon: Icon }: { title: string, value: any, icon?: any }) {
    return (
        <Card className="rounded-xl border bg-background p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground opacity-50" />}
            </div>
            <div className="text-3xl font-semibold tracking-tight mt-1">{value ?? '—'}</div>
        </Card>
    )
}
