"use client"

import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users, ShoppingBag, ShieldCheck,
    MessageSquare, Target, Activity,
    Heart, Clock, Info
} from "lucide-react"

const METRICS_DOCS = [
    {
        category: "Platform Activity",
        metrics: [
            {
                name: "DAU (Daily Active Users)",
                icon: <Users className="w-4 h-4 text-blue-500" />,
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
                name: "Repeat Users (Retention)",
                icon: <Heart className="w-4 h-4 text-rose-500" />,
                formula: "Currently Unimplemented (Returns 0%)",
                details: "Designed to measure the percentage of daily users who also visited in previous periods. Currently, no backend aggregation computes this field, so it remains zero.",
                updated: "N/A"
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
                name: "Completed Bookings",
                icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
                formula: "Count of all BOOKING_COMPLETED UsageEvents",
                details: "Represents the lifetime total of bookings that successfully reached the 'completed' state, filtering out cancellations or incomplete services.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Conversion Rate",
                icon: <Target className="w-4 h-4 text-violet-500" />,
                formula: "(Sessions w/ Booking) / (Total Sessions Started)",
                details: "Measures funnel efficiency. Calculates what percentage of unique user tracking sessions resulted in at least one booking creation event.",
                updated: "Every 30 minutes (Cron)"
            }
        ]
    },
    {
        category: "Supply & Trust",
        metrics: [
            {
                name: "Total Providers",
                icon: <Activity className="w-4 h-4 text-indigo-500" />,
                formula: "Count of Provider documents where status != 'deleted'",
                details: "The total number of service providers currently registered on the platform, encompassing active, pending, and suspended accounts, excluding only deleted ones.",
                updated: "Every 24 hours (Midnight)"
            },
            {
                name: "Avg Trust Score",
                icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                formula: "System average Provider Metrics trust_score",
                details: "The mean trust score across all active providers. Trust scores range from 0-100, influenced by reviews, cancellations, and disputes.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Trust Decay / Recovery",
                icon: <Activity className="w-4 h-4 text-rose-500" />,
                formula: "Count of providers with Negative vs Positive score delta",
                details: "Decay tracks providers whose trust score dropped since the last calculation. Recovery tracks those whose score improved after a penalty.",
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
                formula: "(Complaints w/ 'RESOLVED') / (Total Complaints)",
                details: "The percentage of historically registered complaints that have been successfully closed and marked as 'RESOLVED' by the admin team.",
                updated: "Every 30 minutes (Cron)"
            },
            {
                name: "Pending Complaints",
                icon: <Clock className="w-4 h-4 text-orange-500" />,
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
                subtitle="Metric definitions, backend formulas, and refresh intervals"
            />

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
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{metric.name}</h3>
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
