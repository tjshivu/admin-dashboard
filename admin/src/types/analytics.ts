// --- Geo & Provider List Types ---

export interface GeoCount {
  city: string;
  state: string;
  country: string;
  count: number;
}

export interface TopProviderByRating {
  providerId: string;
  providerName: string;
  rating: number;
  bookingCount: number;
}

export interface TopProviderByIncome {
  providerId: string;
  providerName: string;
  totalIncome: number;
  bookingCount: number;
}

export interface ServiceUsage {
  subCategoryId: string;
  subCategoryName: string;
  count: number;
}

export interface ServiceByCategory {
  categoryId: string;
  categoryName: string;
  count: number;
  avgPrice: number;
}

export interface ServiceBySubCategory extends ServiceByCategory {
  subCategoryId: string;
  subCategoryName: string;
}

// --- Intent Sub-Object ---

export interface UserIntents {
  searchInitiated: number;
  searchCancelled: number;
  searchToProfileViewRatio: number;
  profileViewed: number;
  profileAbandoned: number;
  avgProfileViewDuration: number;
  bookingInitiated: number;
  bookingAbandoned: number;
  totalSessions: number;
  avgSessionDuration: number;
}

export interface ProviderIntents {
  profileViewed: number;
  bookingInitiated: number;
  bookingAbandoned: number;
  totalProfileInteractions: number;
  avgProfileViewDuration: number;
}

export interface SearchBookFunnel {
  sessionStarted: number;
  sessionWithProfileView: number;
  sessionWithBooking: number;
  sessionConversionRate: number;
  avgStepsToBooking: number;
}

// --- Snapshot (Daily / Weekly / Monthly shared fields) ---

export interface SnapshotData {
  // Core activity
  searches: number;
  bookings: number;
  bookings_completed: number;
  reviews_submitted: number;
  complaints: number;
  search_to_booking_ratio: number;
  booking_to_review_ratio: number;
  booking_to_complaint_ratio: number;

  // Active users (field name differs per layer)
  dau?: number;   // daily
  wau?: number;   // weekly
  mau?: number;   // monthly

  // Trust & conversion
  trustScoreTrend: number;
  conversionRate: number;
  trustToConversionCorrelation: number;
  avgProviderTrustScore: number;

  // Provider health
  providersInDecay: number;
  providersInRecovery: number;
  avgDecayRatio: number;
  throttledProviders: number;
  suspendedProviders: number;
  delistedProviders: number;

  // Complaint resolution
  complaintResolutionTime: number;
  complaintResolutionRate: number;
  pendingComplaints: number;

  // Retention
  repeatBookingRate: number;
  userRetentionRate: number;
  newUserCount: number;
  returningUserCount: number;

  // Structured sub-objects
  userIntents?: UserIntents;
  searchBookFunnel?: SearchBookFunnel;
  providerIntents?: ProviderIntents; // weekly & monthly only
  most_used_services?: ServiceUsage[];
  top_rated_professionals?: { providerId: string; averageRating: number }[];

  // Monthly-only cohort retention
  retention?: { month0: number; month1?: number; month2?: number; month3?: number };

  // Metadata
  computeMethod?: 'realtime' | 'fresh' | 'incremental' | 'finalized';
  status?: 'live' | 'finalized';
  lastComputedAt?: string;
}

// --- Dashboard KPI Summary (AllTimeAnalytics) ---

export interface DashboardSummary {
  totalProviders: number;
  totalComplaints: number;
  totalReviews: number;
  bookingCompletionRate: number;
  bookingCancellationRate: number;
  verifiedProviders: number;
  trustedProviders: number;
  suspendedProviders: number;
}

export interface AllTimeAnalytics extends DashboardSummary {
  // Counts
  totalUsers: number;
  totalBookings: number;
  totalCompletedBookings: number;
  totalCancelledBookings: number;
  totalIncome: number;

  // Platform quality
  platformAverageRating: number;
  complaintRate: number;

  // Geo breakdowns
  usersByCity: GeoCount[];
  providersByCity: GeoCount[];

  // Service breakdowns
  totalServices: number;
  mostUsedServices: ServiceUsage[];
  totalServicesByCategory: ServiceByCategory[];
  totalServicesBySubCategory: ServiceBySubCategory[];

  // Leaderboards
  topProvidersByRating: TopProviderByRating[];
  topProvidersByIncome: TopProviderByIncome[];

  // Metadata
  day: string;
  lastComputedAt: string;
}

// --- Provider Admin Types ---

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

// --- Conversion / Session Intent ---

export interface IntentAnalytics {
  success: boolean;
  message?: string;
  data: {
    summary: {
      overallConversionRate: number;
      totalSessionsWithSearch?: number;
      totalSessionsConverted?: number;
      conversionDelta?: {
        profileViewed: number;
        bookingsInitiated: number;
        bookingsCreated: number;
      };
    };
    sessionFunnel?: SearchBookFunnel;
    intentConcerns?: {
      PRICE_CONCERN: number;
      REVIEW_CONCERN: number;
      AVAILABILITY_CONCERN: number;
      RATING_CONCERN: number;
    };
    dailyBreakdown?: Array<{
      day: string;
      sessionStarted: number;
      sessionWithProfileView: number;
      sessionWithBooking: number;
      conversionRate: number;
    }>;
  };
}

export interface TrustTrendPoint {
  date: string;
  trustScore: number;
  trustLevel: string;
  behaviourScore: number;
  reviewScore: number;
  reasons: {
    decayReasons: string[];
    recoveryReasons: string[];
  };
}

export interface TrustRecommendation {
  type: 'improvement';
  reason: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TrustTrendGraphic {
  providerId: string;
  currentTrustScore: number;
  currentTrustLevel: string;
  trend: "IMPROVING" | "STABLE" | "DECLINING";
  percentChange: number;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  trendData: TrustTrendPoint[];
  summary: {
    topDecayReasons: { reason: string; frequency: number }[]; // types-fix
    topRecoveryReasons: { reason: string; frequency: number }[]; // types-fix
    recommendations: TrustRecommendation[];
  };
}

// --- Provider Performance Metrics (Admin) ---
export interface ProviderPerformanceMetrics {
  providerId: string;
  period: string;
  acceptanceRate: number;
  completionRate: number;
  cancellationRate: number;
  complaintRatio: number;
  repeatUserRatio: number;
  totalIncome: number;
  averageRating: number;
}

// --- Daily Trend Summary (Platform-wide intent) ---

export interface DailyTrendSummary {
  day: string;
  providersAnalyzed: number;
  totalIntents: number;
  averageIntentsPerProvider: string;
  highSeverityProvidersCount: number;
  intentBreakdown: {
    PRICE_CONCERN: number;
    REVIEW_CONCERN: number;
    BOOKING_ABANDONED: number;
    PROFILE_ABANDONED: number;
    RATING_CONCERN: number;
    FILTER_MISMATCH: number;
    SEARCH_BOUNCE: number;
    AVAILABILITY_CONCERN: number;
  };
  topConcerns: Array<{ concern: string; count: number; provider: string }>;
  systemInsights: string[];
}
