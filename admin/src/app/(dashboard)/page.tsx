"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"

import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { GridSystem } from "@/components/ui/grid-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    useDashboardSummary,
    useDashboardSnapshots,
    useOperationalInsights,
    useIntentAnalytics
} from "@/hooks/use-analytics-hooks"
import { useLiveAnalytics } from "@/hooks/use-live-analytics" // live
import { DashboardSummary } from "@/types/analytics"

// Helper to format numbers
const formatNum = (num: number) => new Intl.NumberFormat('en-US').format(num)

// --- Color System ---
const COLORS = {
    primary: "#4F46E5",
    secondary: "#6366F1",
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    border: "#E2E8F0"
}

export default function DashboardPage() {
    const router = useRouter()

    // UI State
    const [isChartExpanded, setIsChartExpanded] = useState(false)
    const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')

    // --- Data Fetching via Custom Hooks ---
    const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary()
    const { activeSnapshot, isLoading: isChartLoading } = useDashboardSnapshots(isChartExpanded, chartTab)
    const {
        complaintDistribution,
        reviewBreakdown,
        complaints,
        reviews
    } = useOperationalInsights()

    const isLoadingComplaints = complaints.isLoading
    const isLoadingReviews = reviews.isLoading

    const barChartData = [
        { name: 'Searches', value: activeSnapshot?.searches || 0 },
        { name: 'Bookings', value: activeSnapshot?.bookings || 0 }
    ]
    const currentActivitySum = (activeSnapshot?.searches || 0) + (activeSnapshot?.bookings || 0)
    const activePeriodLabel = chartTab === 'daily' ? 'Today' : chartTab === 'weekly' ? 'This Week' : 'This Month'

    return (
        <PageContainer>
            <SectionHeader title="Overview" />

            {/* Section 0: LIVE KPI STRIP */}
            <LiveKPIStrip />

            {/* Section 1: KPI STRATEGIC ROW */}
            <GridSystem cols={5}>
                <KPICard
                    title="Total Providers"
                    value={isLoadingSummary ? "..." : formatNum(summary?.totalProviders || 0)}
                    status={summary && summary.totalProviders > 0 ? "Registered on platform" : "No providers yet"}
                    onClick={() => router.push('/providers')}
                />
                <KPICard
                    title="Total Complaints"
                    value={isLoadingSummary ? "..." : formatNum(summary?.totalComplaints || 0)}
                    status="Total records (all statuses)"
                    onClick={() => router.push('/complaints?tab=active')}
                />
                <KPICard
                    title="Total Reviews"
                    value={isLoadingSummary ? "..." : formatNum(summary?.totalReviews || 0)}
                    status={summary && summary.totalReviews > 0 ? "Reviews logged" : "Looking good"}
                    onClick={() => router.push('/reviews?flagged=true')}
                />
                <KPICard
                    title="Completion Rate"
                    value={isLoadingSummary ? "..." : `${((summary?.bookingCompletionRate || 0) * 100).toFixed(1)}%`}
                    status="Completed vs total bookings"
                    onClick={() => router.push('/analytics')}
                />
                <KPICard
                    title="Cancellation Rate"
                    value={isLoadingSummary ? "..." : `${((summary?.bookingCancellationRate || 0) * 100).toFixed(1)}%`}
                    status="Cancelled vs total bookings"
                    onClick={() => router.push('/analytics')}
                />
            </GridSystem>

            {/* Section 1.2: PROVIDER STATUS SUMMARY CARD */}
            <div className="mt-8">
                <ProviderStatusSummary data={summary} isLoading={isLoadingSummary} />
            </div>

            {/* Section 1.5: INTENT & COMPLAINT SUMMARY CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <IntentSummarySection />
                <ComplaintResolutionSection />
            </div>


            {/* Section 2: CORE ANALYTICS CARD */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <CardTitle>Platform Snapshot</CardTitle>
                            {chartTab === 'daily' && (
                                <div className="flex items-center px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">Live (Today)</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Current period activity vs baseline</p>
                    </div>
                    <button
                        onClick={() => setIsChartExpanded(!isChartExpanded)}
                        className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                        {isChartExpanded ? (
                            <><ChevronUp className="w-4 h-4" /> Collapse</>
                        ) : (
                            <><ChevronDown className="w-4 h-4" /> Expand</>
                        )}
                    </button>
                </CardHeader>
                <CardContent>
                    {isChartExpanded && (
                        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4">
                            {(['daily', 'weekly', 'monthly'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setChartTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${chartTab === tab
                                        ? 'bg-violet-600 text-white'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Summary
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="w-full lg:flex-1 h-[280px]">
                            {isChartLoading ? (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Loading snapshot...</div>
                            ) : activeSnapshot ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }} barSize={60}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={40} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '13px' }}
                                        />
                                        <Bar dataKey="value" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">No analytics data available for selected period.</div>
                            )}
                        </div>
                        <div className="w-full lg:w-48 shrink-0 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 justify-center h-full">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{activePeriodLabel} Activity</p>
                                <p className="text-3xl font-bold text-slate-900">{formatNum(currentActivitySum)}</p>
                                <p className="text-sm text-slate-500">Searches + Bookings</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: OPERATIONAL INSIGHTS */}
            <GridSystem cols={2}>
                {/* Complaints Donut */}
                <Card>
                    <CardHeader className="pb-2 space-y-0">
                        <CardTitle className="text-base">Complaint Status</CardTitle>
                        <p className="text-xs text-slate-500 mt-1">Distribution of recent complaints</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px] relative">
                            {isLoadingComplaints ? (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Loading...</div>
                            ) : complaintDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={complaintDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {complaintDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid currentColor',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                fontSize: '13px',
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--foreground)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">No active complaints</div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {complaintDistribution.map(d => (
                                <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    {d.name} ({d.value})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Review Moderation Bar */}
                <Card>
                    <CardHeader className="pb-2 space-y-0">
                        <CardTitle className="text-base dark:text-white">Review Moderation</CardTitle>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Status breakdown for flagged reviews</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px] w-full flex items-center justify-center">
                            {isLoadingReviews ? (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Loading...</div>
                            ) : reviewBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reviewBreakdown} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-neutral-800" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'currentColor', fontWeight: 500 }} dy={10} className="text-slate-500 dark:text-neutral-400" />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} width={40} className="text-slate-500 dark:text-neutral-400" />
                                        <Tooltip
                                            cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid currentColor',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                fontSize: '13px',
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--foreground)'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                            {reviewBreakdown.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">No flagged reviews</div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {reviewBreakdown.map((d: any) => (
                                <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    {d.name} ({d.value})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </GridSystem>

        </PageContainer>
    )
}

function IntentSummarySection() {
    const { data: intentRes, isLoading, error } = useIntentAnalytics()

    if (error || (intentRes && !intentRes.success && intentRes.message?.includes("not available"))) {
        return (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 h-full flex items-center justify-center text-sm text-slate-500 font-medium">
                Intent analytics not available yet.
            </div>
        )
    }

    const data = intentRes?.data?.data
    const summary = data?.summary
    const rate = summary?.overallConversionRate || 0

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">User Intent</h3>
                <div className="h-px flex-1 bg-slate-200"></div>
                {isLoading && <span className="text-[10px] text-slate-400 animate-pulse font-bold">SYNCING</span>}
            </div>

            <IntentCard
                title="Conversion Rate"
                value={`${(rate * 100).toFixed(1)}%`}
                isLoading={isLoading}
            />
        </div>
    )
}

function ComplaintResolutionSection() {
    // Current Dashboard logic uses Weekly for this
    const { weekly } = useDashboardSnapshots(true, 'weekly')
    const weeklySnapshot = weekly.data
    const isLoading = weekly.isLoading

    const resTime = weeklySnapshot?.complaintResolutionTime
    const resRate = weeklySnapshot?.complaintResolutionRate

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Complaint Performance</h3>
                <div className="h-px flex-1 bg-slate-200"></div>
                {isLoading && <span className="text-[10px] text-slate-400 animate-pulse font-bold">SYNCING</span>}
            </div>

            <GridSystem cols={2}>
                <IntentCard
                    title="Avg Resolution Time"
                    value={isLoading ? "..." : resTime ? `${Number(resTime).toFixed(1)} hrs` : "No data yet"}
                    isLoading={isLoading}
                />
                <IntentCard
                    title="Resolution Rate"
                    value={isLoading ? "..." : resRate ? `${(Number(resRate) * 100).toFixed(1)}%` : "No data yet"}
                    isLoading={isLoading}
                />
            </GridSystem>
        </div>
    )
}


function ProviderStatusSummary({ data, isLoading }: { data: DashboardSummary | undefined, isLoading: boolean }) {
    if (isLoading) return (
        <Card className="h-32 flex items-center justify-center">
            <span className="text-slate-400 text-sm animate-pulse">Loading status...</span>
        </Card>
    )

    if (!data) return (
        <Card className="p-6 text-center text-slate-500 text-sm border-dashed">
            No lifecycle data yet.
        </Card>
    )

    const total = data.totalProviders ?? 0
    const verified = data.verifiedProviders ?? 0
    const trusted = data.trustedProviders ?? 0
    const suspended = data.suspendedProviders ?? 0

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-neutral-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">Provider Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2.5 max-w-sm">
                    <LifecycleRow label="Total Providers" count={total} color="bg-slate-400" />
                    <LifecycleRow label="Verified" count={verified} color="bg-indigo-500" />
                    <LifecycleRow label="Trusted" count={trusted} color="bg-emerald-500" />
                    <LifecycleRow label="Suspended" count={suspended} color="bg-rose-500" />
                </div>
            </CardContent>
        </Card>
    )
}

function LifecycleRow({ label, count, color }: { label: string, count: number, color: string }) {
    return (
        <div className="flex items-center justify-between text-sm group">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-slate-500 dark:text-neutral-400 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{formatNum(count)}</span>
        </div>
    )
}


function IntentCard({ title, value, isLoading }: { title: string, value: string, isLoading: boolean }) {

    return (
        <Card className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 flex flex-col pt-4">
                <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-tight mb-1">{title}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {isLoading ? <div className="h-8 w-16 bg-slate-100 dark:bg-neutral-800 animate-pulse rounded" /> : value}
                </span>
            </CardContent>
        </Card>
    )
}

function KPICard({ title, value, status, onClick }: { title: string, value: string | number, status: string, onClick: () => void }) {
    return (
        <Card onClick={onClick} className="group cursor-pointer hover:border-violet-500 dark:hover:border-violet-400 transition-all hover:shadow-[0_4px_12px_rgba(79,70,229,0.08)]">
            <CardContent className="p-6 pt-6">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400 mb-2 uppercase tracking-wider block">{title}</span>
                <span className="text-3xl font-bold text-slate-900 dark:text-white mb-3 block">{value}</span>
                {status && (
                    <span className="text-sm text-violet-600 dark:text-violet-400 font-medium block">{status}</span>
                )}
            </CardContent>
        </Card>
    )
}

// --- Live KPI Strip ---

function LiveKPIStrip() {
    const { data, isLoading } = useLiveAnalytics()

    // status
    const isLive = !data?.status || data.status === 'live'

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xs font-bold text-slateate-500 dark:text-neutral-400 uppercase tracking-widest">
                    Real-Time Platform
                </h3>
                {/* badge */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${isLive
                    ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400'
                    : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isLive ? 'Live' : 'Finalized'}
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-neutral-800" />
            </div>

            {/* stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <LiveKPIStat
                    label="DAU"
                    value={isLoading ? '...' : formatNum(data?.dau || 0)}
                    sub="Active users today"
                />
                <LiveKPIStat
                    label="Bookings"
                    value={isLoading ? '...' : formatNum(data?.bookings || 0)}
                    sub="Created today"
                />
                <LiveKPIStat
                    label="Conversion"
                    value={isLoading ? '...' : `${((data?.conversionRate || 0) * 100).toFixed(1)}%`}
                    sub="Search → Booking"
                />
                <LiveKPIStat
                    label="Avg Trust"
                    value={isLoading ? '...' : `${(data?.avgProviderTrustScore || 0).toFixed(1)}`}
                    sub="Provider score"
                />
                <LiveKPIStat
                    label="Resolution"
                    value={isLoading ? '...' : `${((data?.complaintResolutionRate || 0) * 100).toFixed(1)}%`}
                    sub="Complaint rate"
                />
                <LiveKPIStat
                    label="In Decay"
                    value={isLoading ? '...' : formatNum(data?.providersInDecay || 0)}
                    sub="Providers flagged"
                    danger={Boolean(data && (data.providersInDecay || 0) > 0)}
                />
            </div>
        </div>
    )
}

function LiveKPIStat({
    label, value, sub, danger = false
}: {
    label: string; value: string; sub: string; danger?: boolean;
}) {
    return (
        <Card className="border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardContent className="p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 block mb-1">
                    {label}
                </span>
                {/* value */}
                <span className={`text-xl font-black block mb-0.5 ${danger ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                    }`}>
                    {value}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">{sub}</span>
            </CardContent>
        </Card>
    )
}
