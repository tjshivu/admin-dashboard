import { useQuery } from "@tanstack/react-query"
import { fetchLiveTodayAnalytics } from "@/lib/admin/api"
import { SnapshotData } from "@/types/admin/analytics"

/**
 * Hook to fetch live delta analytics for the current day.
 * Polling is set to 5 minutes to maintain backend freshness.
 */
export function useLiveAnalytics() {
    return useQuery<SnapshotData>({
        queryKey: ['live-analytics-today'],
        queryFn: fetchLiveTodayAnalytics,
        refetchInterval: 10 * 60 * 1000,  // polling
        staleTime: 5 * 60 * 1000,         // live
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,          // reconnect
        retry: false
    })
}
