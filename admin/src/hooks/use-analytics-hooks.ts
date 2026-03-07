import { useQuery } from "@tanstack/react-query"
import {
    fetchAllTimeAnalytics,
    fetchDailyAnalytics,
    fetchWeeklyAnalytics,
    fetchMonthlyAnalytics,
    fetchLiveTodayAnalytics,
    fetchTrustTrendGraphic,
    fetchDailyTrendSummary,
    get
} from "@/lib/api"
import {
    getUTCWeekStr,
    getUTCMonthStr
} from "@/lib/date-utils"
import {
    AllTimeAnalytics,
    SnapshotData,
    ComplaintData,
    ReviewData,
    IntentAnalytics,
    TrustTrendGraphic,
    DailyTrendSummary,
    ProviderPerformanceMetrics
} from "@/types/analytics"
import { useMemo } from "react"

export function useDashboardSummary() {
    return useQuery<AllTimeAnalytics>({
        queryKey: ["dashboard-summary"],
        queryFn: fetchAllTimeAnalytics,
        staleTime: 15 * 60 * 1000, // all-time
        retry: false,
        refetchOnWindowFocus: false
    })
}

export function useDashboardSnapshots(
    isChartExpanded: boolean,
    chartTab: 'daily' | 'weekly' | 'monthly'
) {
    const daily = useQuery<SnapshotData>({
        queryKey: ["live-analytics-today"],
        queryFn: fetchLiveTodayAnalytics,
        refetchInterval: 5 * 60 * 1000,
        retry: false
    })

    const weekly = useQuery<SnapshotData | null>({
        queryKey: ["weekly-snapshot-dash"],
        queryFn: () => fetchWeeklyAnalytics(getUTCWeekStr()),
        enabled: isChartExpanded && chartTab === 'weekly',
        retry: false
    })

    const monthly = useQuery<SnapshotData | null>({
        queryKey: ["monthly-snapshot-dash"],
        queryFn: () => fetchMonthlyAnalytics(getUTCMonthStr()),
        enabled: isChartExpanded && chartTab === 'monthly',
        retry: false
    })

    const activeSnapshot = chartTab === 'daily' ? daily.data : chartTab === 'weekly' ? weekly.data : monthly.data
    const isLoading = chartTab === 'daily' ? (daily.isLoading || daily.isFetching)
        : chartTab === 'weekly' ? (weekly.isLoading || weekly.isFetching)
            : (monthly.isLoading || monthly.isFetching)

    return { daily, weekly, monthly, activeSnapshot, isLoading }
}

export function useOperationalInsights() {
    const complaints = useQuery({
        queryKey: ["complaints-snapshot"],
        queryFn: () => get<ComplaintData[]>("/complaints/admin/list?limit=100"),
        retry: false
    })

    const reviews = useQuery({
        queryKey: ["reviews-snapshot"],
        queryFn: () => get<ReviewData[]>("/admin/reviews/flagged?limit=100"),
        retry: false
    })

    const complaintDistribution = useMemo(() => {
        if (!complaints.data?.data) return []
        const counts = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 }
        complaints.data.data.forEach((c) => {
            if (counts[c.status] !== undefined) {
                counts[c.status]++
            }
        })
        return [
            { name: 'Open', value: counts.OPEN, color: "#FDBA74" },
            { name: 'In Progress', value: counts.IN_PROGRESS, color: "#D97706" },
            { name: 'Resolved', value: counts.RESOLVED, color: "#16A34A" },
            { name: 'Rejected', value: counts.REJECTED, color: "#E2E8F0" }
        ].filter(d => d.value > 0)
    }, [complaints.data])

    const reviewBreakdown = useMemo(() => {
        if (!reviews.data?.data) return []
        // ReviewReport status values are 'pending' / 'resolved' / 'rejected' (lowercase)
        const counts = { pending: 0, resolved: 0, rejected: 0 }
        reviews.data.data.forEach((r) => {
            const s = (r.status || '').toLowerCase() as keyof typeof counts
            if (counts[s] !== undefined) counts[s]++
        })
        return [
            { name: 'Pending', value: counts.pending, color: "#D97706" },
            { name: 'Resolved', value: counts.resolved, color: "#16A34A" },
            { name: 'Rejected', value: counts.rejected, color: "#E2E8F0" }
        ]
    }, [reviews.data])

    return {
        complaints,
        reviews,
        complaintDistribution,
        reviewBreakdown
    }
}

export function useAnalyticsData(
    selectedDay: string,
    selectedWeek: string,
    selectedMonth: string
) {
    const allTime = useQuery<AllTimeAnalytics>({
        queryKey: ['all-time'],
        queryFn: fetchAllTimeAnalytics,
        staleTime: 15 * 60 * 1000, // all-time
        retry: false,
        refetchOnWindowFocus: false
    })

    const daily = useQuery<SnapshotData>({
        queryKey: ['daily-snapshot', selectedDay],
        queryFn: () => fetchDailyAnalytics(selectedDay),
        staleTime: 10 * 60 * 1000, // snapshot
        retry: false,
        refetchOnWindowFocus: false
    })

    const weekly = useQuery<SnapshotData | null>({
        queryKey: ['weekly-snapshot', selectedWeek],
        queryFn: () => fetchWeeklyAnalytics(selectedWeek),
        staleTime: 10 * 60 * 1000, // snapshot
        retry: false,
        refetchOnWindowFocus: false
    })

    const monthly = useQuery<SnapshotData | null>({
        queryKey: ['monthly-snapshot', selectedMonth],
        queryFn: () => fetchMonthlyAnalytics(selectedMonth),
        staleTime: 10 * 60 * 1000, // snapshot
        retry: false,
        refetchOnWindowFocus: false
    })

    return { allTime, daily, weekly, monthly }
}

export function useIntentAnalytics() {
    return useQuery({
        queryKey: ["session-intent-summary"],
        queryFn: () => get<IntentAnalytics>("/analytics/conversion/session-based"),
        retry: false,
        refetchOnWindowFocus: false
    })
}

// trust
export function useTrustTrendGraphic(providerId: string, days: number = 30) {
    return useQuery<TrustTrendGraphic>({
        queryKey: ["trust-trend-graphic", providerId, days],
        queryFn: () => fetchTrustTrendGraphic(providerId, days),
        staleTime: 5 * 60 * 1000, // trend
        enabled: Boolean(providerId),
        retry: false,
        refetchOnWindowFocus: false
    })
}

// intent
export function useDailyTrendSummary(day: string) {
    return useQuery<DailyTrendSummary | null>({
        queryKey: ["daily-trend-summary", day],
        queryFn: () => fetchDailyTrendSummary(day),
        staleTime: 5 * 60 * 1000, // trend
        enabled: Boolean(day),
        retry: false,
        refetchOnWindowFocus: false
    })
}

export function useProviderPerformanceMetrics(providerId: string, lastDays: number = 7) {
    return useQuery<ProviderPerformanceMetrics>({
        queryKey: ["provider-performance-metrics", providerId, lastDays],
        queryFn: async () => {
            const res = await get<ProviderPerformanceMetrics>(`/analytics/provider/${providerId}/metrics?lastDays=${lastDays}`)
            if (!res?.success) throw new Error("Failed to fetch provider metrics")
            return res.data
        },
        enabled: Boolean(providerId),
        staleTime: 5 * 60 * 1000,
        retry: false
    })
}

// Custom hook to bypass the backend metric bug by fetching all providers
export function useLiveProvidersCount() {
    return useQuery({
        queryKey: ["live-providers-count"],
        queryFn: async () => {
            const res = await get<any[]>("/admin/providers")
            if (!res?.success || !res.data) return 0
            return res.data.filter((p: any) => p.trust_status === 'VERIFIED').length
        },
        staleTime: 5 * 60 * 1000,
        retry: false
    })
}
