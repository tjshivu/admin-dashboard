import { useQuery } from "@tanstack/react-query"
import {
    fetchAllTimeAnalytics,
    fetchDailyAnalytics,
    fetchWeeklyAnalytics,
    fetchMonthlyAnalytics,
    fetchLiveTodayAnalytics,
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
    IntentAnalytics
} from "@/types/analytics"
import { useMemo } from "react"

export function useDashboardSummary() {
    return useQuery<AllTimeAnalytics>({
        queryKey: ["dashboard-summary"],
        queryFn: fetchAllTimeAnalytics,
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
        const counts = { OPEN: 0, RESOLVED: 0, REJECTED: 0 }
        reviews.data.data.forEach((r) => {
            if (counts[r.status] !== undefined) {
                counts[r.status]++
            }
        })
        return [
            { name: 'Pending', value: counts.OPEN, color: "#D97706" },
            { name: 'Resolved', value: counts.RESOLVED, color: "#16A34A" },
            { name: 'Rejected', value: counts.REJECTED, color: "#E2E8F0" }
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
        retry: false,
        refetchOnWindowFocus: false
    })

    const daily = useQuery<SnapshotData>({
        queryKey: ['daily-snapshot', selectedDay],
        queryFn: () => fetchDailyAnalytics(selectedDay),
        retry: false,
        refetchOnWindowFocus: false
    })

    const weekly = useQuery<SnapshotData | null>({
        queryKey: ['weekly-snapshot', selectedWeek],
        queryFn: () => fetchWeeklyAnalytics(selectedWeek),
        retry: false,
        refetchOnWindowFocus: false
    })

    const monthly = useQuery<SnapshotData | null>({
        queryKey: ['monthly-snapshot', selectedMonth],
        queryFn: () => fetchMonthlyAnalytics(selectedMonth),
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
