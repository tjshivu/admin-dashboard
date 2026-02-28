export interface DashboardSummary {
    totalProviders: number;
    totalComplaints: number;
    totalReviews: number;
    bookingCompletionRate: number;
    bookingCancellationRate: number;
    verifiedProviders?: number;
    trustedProviders?: number;
    suspendedProviders?: number;
    [key: string]: number | undefined;
}

export interface SnapshotData {
    searches: number;
    bookings: number;
    reviews?: number;
    reviews_submitted?: number;
    complaints: number;
    complaintResolutionTime?: number;
    complaintResolutionRate?: number;
    [key: string]: number | undefined;
}

export interface AllTimeAnalytics extends DashboardSummary {
    totalUsers: number;
    totalBookings: number;
    totalCompletedBookings: number;
    platformAverageRating: number;
}

export interface ComplaintData {
    _id: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
    [key: string]: unknown;
}

export interface ReviewData {
    _id: string;
    status: 'OPEN' | 'RESOLVED' | 'REJECTED';
    [key: string]: unknown;
}

export interface IntentAnalytics {
    success: boolean;
    message?: string;
    data: {
        summary: {
            overallConversionRate: number;
        };
    };
}
