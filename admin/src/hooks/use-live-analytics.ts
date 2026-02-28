import { useQuery } from "@tanstack/react-query"
import { fetchLiveTodayAnalytics } from "@/lib/api"
import { SnapshotData } from "@/types/analytics"

/**
 * Hook to fetch live delta analytics for the current day.
 * Polling is set to 5 minutes to maintain backend freshness.
 */
export function useLiveAnalytics() {
    return useQuery<SnapshotData>({
        queryKey: ['live-analytics-today'],
        queryFn: fetchLiveTodayAnalytics,
        refetchInterval: 10 * 60 * 1000,   // 10 minutes
        staleTime: 60 * 10 * 1000,       // 10 minutes cache
        refetchOnWindowFocus: true,
        retry: false
    })
}
