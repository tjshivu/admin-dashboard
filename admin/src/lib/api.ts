if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined. Check .env configuration.");
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { queryClient } from "./query-client";
import {
    DashboardSummary,
    SnapshotData,
    AllTimeAnalytics,
    IntentAnalytics
} from "@/types/analytics";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function api(path: string, options: FetchOptions = {}): Promise<Response> {
    // Ensure path begins with a slash, and BASE_URL doesn't end with a duplicate slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const url = `${cleanBaseUrl}${normalizedPath}`;

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Ensure credentials are sent with requests
    const config: RequestInit = {
        ...options,
        headers,
        credentials: "include",
    };

    try {
        const res = await fetch(url, config);

        // Auto-redirect to login on 401
        if (res.status === 401 && !path.includes("/login")) {
            if (typeof window !== "undefined") {
                // Return response instead of throwing to avoid 'Failed to fetch' mimicking
            }
        }

        return res;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}

export async function get<T = unknown>(path: string): Promise<ApiResponse<T> | null> {
    const res = await api(path, { method: "GET" });
    if (!res.ok) return null;
    return res.json();
}

export async function post<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const res = await api(path, {
        method: "POST",
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }
    return res.json();
}

export async function put<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const res = await api(path, {
        method: "PUT",
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }
    return res.json();
}

export async function patch<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const res = await api(path, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }
    return res.json();
}

export async function del<T = unknown>(path: string): Promise<ApiResponse<T>> {
    const res = await api(path, { method: "DELETE" });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }
    return res.json();
}

// Analytics Fetch Functions
export async function fetchDailyAnalytics(date: string): Promise<SnapshotData> {
    const res = await get<SnapshotData>(`/analytics/daily/${date}`);
    if (!res?.success) throw new Error("Failed to fetch daily analytics");
    return res.data;
}


export async function fetchWeeklyAnalytics(week: string): Promise<SnapshotData | null> {
    const res = await get<SnapshotData>(`/analytics/weekly/${week}`);
    if (!res) return null;
    if (!res.success) throw new Error("Failed to fetch weekly analytics");
    return res.data;
}

export async function fetchMonthlyAnalytics(month: string): Promise<SnapshotData | null> {
    const res = await get<SnapshotData>(`/analytics/monthly/${month}`);
    if (!res) return null;
    if (!res.success) throw new Error("Failed to fetch monthly analytics");
    return res.data;
}


export async function fetchAllTimeAnalytics(): Promise<AllTimeAnalytics> {
    const res = await get<AllTimeAnalytics>(`/analytics/all-time`);
    if (!res?.success) throw new Error("Failed to fetch all-time analytics");
    return res.data;
}

export async function fetchLiveTodayAnalytics(): Promise<SnapshotData> {
    const res = await get<SnapshotData>(`/analytics/live-today`);
    if (!res?.success) throw new Error("Failed to fetch live analytics");
    return res.data;
}


export async function fetchSystemHealth() {
    const res = await get(`/admin/system-health`);
    if (!res?.success) throw new Error("Failed to fetch system health");
    return res.data;
}

export async function logAdminAction(title: string, description: string) {
    try {
        await post("/notifications/create", {
            recipientType: "admin",
            // Assuming no specific recipientId refers to a global admin broadcast, 
            // since the backend requires recipientId, we can pass a dummy ObjectId or the current admin's ID.
            recipientId: "000000000000000000000000",
            event: title,
            payload: { description }
        });
        // Invalidate notifications query to trigger instant bell refresh
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
        console.error("Failed to log admin action", err);
    }
}

console.log("API BASE:", process.env.NEXT_PUBLIC_API_URL);
