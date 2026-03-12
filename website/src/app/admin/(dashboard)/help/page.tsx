"use client"

import { PageContainer } from "@/components/admin/ui/page-container"
import { SectionHeader } from "@/components/admin/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import {
    Users, ShoppingBag, ShieldCheck,
    MessageSquare, Target, Activity,
    Heart, Clock, Info, Star, TrendingUp
} from "lucide-react"

const METRICS_DOCS = [
    {
        category: "Platform Activity",
        metrics: [
            {
                name: "DAU (Daily Active Users)",
                icon: <Users className="w-4 h-4 text-blue-500" />,
                isLive: true,
                formula: "Count of unique users triggering a UsageEvent today",
                details: "Measures unique distinct users logging in or opening the app on the current day. Excludes guest users until they authenticate or trigger an event.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Total Users",
                icon: <Users className="w-4 h-4 text-indigo-500" />,
                formula: "Count of all User documents in database",
                details: "The lifetime total of all registered user accounts. This is a simple count operation on the backend User collection.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Retention Rate",
                icon: <Heart className="w-4 h-4 text-rose-500" />,
                isLive: true,
                formula: "(Retained Users) / (Yesterday's Users)",
                details: "Measures day-over-day stickiness. Calculates the percentage of unique users active yesterday who returned to the platform today.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "New Users",
                icon: <Users className="w-4 h-4 text-blue-500" />,
                isLive: true,
                formula: "Count of User documents created today",
                details: "Measures platform growth by counting unique user registrations that occurred within the current calendar day.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Returning Users",
                icon: <Users className="w-4 h-4 text-indigo-500" />,
                isLive: true,
                formula: "DAU - New Users",
                details: "Measures existing user engagement. These are active users who registered on any day prior to the current one.",
                updated: "Every 30 minutes (Cron)"
            }
        ]
    },
    {
        category: "Demand & Bookings",
        metrics: [
            {
                name: "Total Bookings",
                icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
                formula: "Count of all BOOKING_CREATED UsageEvents",
                details: "Represents the total lifetime volume of all bookings ever initiated on the platform, regardless of their current status (completed, cancelled, or pending).",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Total Successful",
                icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
                formula: "Count of all BOOKING_COMPLETED UsageEvents",
                details: "Represents the lifetime total of bookings that successfully reached the 'completed' state, filtering out cancellations or incomplete services.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Booking Conversion",
                icon: <Target className="w-4 h-4 text-violet-500" />,
                isLive: true,
                formula: "(Sessions w/ Booking) / (Total Sessions Started)",
                details: "Measures task-oriented efficiency. Calculates what percentage of unique search intents resulted in at least one booking creation.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Funnel Efficiency",
                icon: <Target className="w-4 h-4 text-violet-500" />,
                isLive: true,
                formula: "(Direct Conversions) / (Total Sessions)",
                details: "Measures overall platform health. The percentage of all visitor sessions that successfully converted into a transaction.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Friction Rate",
                icon: <Activity className="w-4 h-4 text-rose-500" />,
                isLive: true,
                formula: "Avg(Steps per booking)",
                details: "Measures the complexity of the booking process. The average number of clicks/interactions a user goes through before successfully booking.",
                updated: "Every 30 minutes (Cron)"
            }
        ]
    },
    {
        category: "Supply & Trust",
        metrics: [
            {
                name: "Verified Providers",
                icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                formula: "Count of Providers where trust_status === 'VERIFIED'",
                details: "The total number of providers who have successfully completed the identity and quality verification process.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Trusted Providers",
                icon: <Star className="w-4 h-4 text-blue-500" />,
                formula: "Count of providers with TrustScore > 85",
                details: "Providers who consistently maintain high performance standards and have earned the 'Trusted' badge.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Suspended Providers",
                icon: <Activity className="w-4 h-4 text-rose-500" />,
                formula: "Count of Providers where status === 'suspended'",
                details: "Accounts currently restricted from receiving new bookings due to policy violations or unresolved disputes.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Total Services",
                icon: <ShoppingBag className="w-4 h-4 text-indigo-500" />,
                formula: "Count of all Service documents",
                details: "The lifetime total of unique service offerings listed across all categories by all providers.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Platform Average Rating",
                icon: <Star className="w-4 h-4 text-amber-500" />,
                formula: "Average of all non-deleted Reviews",
                details: "The global mean rating across every service provided on the platform, reflecting overall ecosystem satisfaction.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Avg Provider Trust Score",
                icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                isLive: true,
                formula: "System average Provider Metrics trust_score",
                details: "The mean trust score across all active providers. Trust scores range from 0-100, influenced by reviews, cancellations, and disputes.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Throttled Providers",
                icon: <Activity className="w-4 h-4 text-amber-500" />,
                isLive: true,
                formula: "Count(Providers w/ restricted visibility)",
                details: "Providers who have been temporarily limited in search results due to low response rates or minor policy warnings.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Delisted Providers",
                icon: <ShieldCheck className="w-4 h-4 text-slate-500" />,
                isLive: true,
                formula: "Count(Providers hidden from search)",
                details: "Providers whose listings are completely hidden from the public search while they undergo review or corrective action.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Review Density",
                icon: <Star className="w-4 h-4 text-violet-500" />,
                formula: "Total Reviews / Total Success Bookings",
                details: "Measures the completeness of feedback. Shows what percentage of successful services result in a user review.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Supply Decay/Recovery",
                icon: <TrendingUp className="w-4 h-4 text-rose-500" />,
                isLive: true,
                formula: "Delta(TrustScore) over 24h",
                details: "Tracks the momentum of provider quality. 'Decay' represents falling scores, while 'Recovery' represents improvements.",
                updated: "Every 30 minutes (Cron)"
            }
        ]
    },
    {
        category: "Moderation",
        metrics: [
            {
                name: "Total Complaints",
                icon: <MessageSquare className="w-4 h-4 text-slate-500" />,
                formula: "Count of all Complaint documents",
                details: "The absolute lifetime sum of all complaints registered by users or providers, encompassing all statuses (open, active, or resolved).",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Resolution Rate",
                icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                isLive: true,
                formula: "(Complaints w/ 'RESOLVED') / (Total Complaints)",
                details: "The percentage of historically registered complaints that have been successfully closed and marked as 'RESOLVED' by the admin team.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Open Griefs",
                icon: <Clock className="w-4 h-4 text-orange-500" />,
                isLive: true,
                formula: "Count of Complaints w/ status NOT 'RESOLVED'",
                details: "The current active backlog. Counts all complaints sitting in 'OPEN' or 'IN_PROGRESS' states awaiting admin review.",
                updated: "Every 30 minutes (Cron)"
            }
        ]
    }
]

export default function HelpDocsPage() {
    return (
        <PageContainer>
            <SectionHeader
                title="Help & Documentation"
            />
            <p className="text-sm text-slate-500 mt-1 mb-6">Metric definitions, backend formulas, and refresh intervals</p>

            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-3 text-blue-800 dark:text-blue-300">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold mb-1">How Data Updates</p>
                    <p>The analytics engine employs two strategies: <strong>Real-time Cron Jobs</strong> run every 30 minutes to aggregate live daily activity, while <strong>Nightly Batch Jobs</strong> run at Midnight (UTC) to calculate lifetime (All-Time) totals directly from the database to save performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {METRICS_DOCS.map((section, i) => (
                    <Card key={i} className="border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden bg-white dark:bg-neutral-900">
                        <CardHeader className="bg-slate-50 dark:bg-neutral-900 border-b border-slate-100 dark:border-neutral-800 py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-neutral-300">
                                {section.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {section.metrics.map((metric, j) => (
                                    <div key={j} className="p-5 hover:bg-slate-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 group-hover:scale-110 transition-transform">
                                                    {metric.icon}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{metric.name}</h3>
                                                    {'isLive' in metric && metric.isLive && (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-mono whitespace-nowrap bg-slate-50 dark:bg-neutral-900 text-slate-500 shadow-none border-dashed border-slate-300">
                                                {metric.updated}
                                            </Badge>
                                        </div>

                                        <div className="pl-9">
                                            <div className="text-xs font-mono text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded inline-block mb-2 font-medium border border-violet-100 dark:border-violet-800/30">
                                                {metric.formula}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                                {metric.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PageContainer>
    )
}
