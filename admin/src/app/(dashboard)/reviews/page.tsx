"use client"

import { useEffect, useState } from "react"
import { get, patch, put } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ShieldAlert, FileText, Ban, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { useToast } from "@/components/providers/toast-provider"
import { useNotifications } from "@/hooks/use-notifications"

interface ReviewImage {
    image_url: string
    image_id: string
    thumbnail_url?: string
}

interface Review {
    _id: string
    provider_id: { _id: string, name?: string, email?: string }
    user_id: { _id: string, name?: string, email?: string }
    average_rating: number
    comment?: string
    visibility: boolean
    hide_reason?: string
    report_count?: number
    adminActionRequired?: boolean
    adminActionReason?: string
    ai_trust_score?: number
    ai_risk_summary?: string
    ai_flag_reasons?: string[]
    ai_component_scores?: {
        text_risk?: number
        nsfw_risk?: number
        abuse_risk?: number
        violence_risk?: number
    }
    ai_processed?: boolean
    ai_flagged?: boolean
    images?: ReviewImage[]
    created_at: string
}

interface ReviewReport {
    _id: string
    review_id: Review
    reported_by: { _id: string, name?: string, email?: string }
    reason: string
    description?: string
    status: string
    admin_notes?: string
    createdAt: string
}

const HIDE_REASONS = [
    "abuse_report",
    "downvote_threshold",
    "admin",
    "ai_flagged_nsfw",
    "ai_flagged_abuse",
    "ai_flagged_images",
    "ai_flagged"
]

export default function ReviewsPage() {
    const [viewMode, setViewMode] = useState<"all" | "flagged" | "ai_flagged">("all")
    const [reviews, setReviews] = useState<Review[]>([])
    const [reports, setReports] = useState<ReviewReport[]>([])
    const [loading, setLoading] = useState(true)

    // Selection State
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [selectedReport, setSelectedReport] = useState<ReviewReport | null>(null)

    // Action State
    const [actionLoading, setActionLoading] = useState(false)
    const [hideReasonOptionsOpen, setHideReasonOptionsOpen] = useState(false)
    const [selectedHideReason, setSelectedHideReason] = useState<string>("")
    const [adminNotes, setAdminNotes] = useState("")
    const { showToast } = useToast()
    const { markByEvent } = useNotifications()

    const loadData = async () => {
        setLoading(true)
        setSelectedReview(null)
        setSelectedReport(null)
        try {
            // Always fetch both to keep badge counts accurate across all tabs
            const [reviewsRes, reportsRes] = await Promise.all([
                get<Review[]>("/reviews/admin/list"),
                get<ReviewReport[]>("/admin/reviews/flagged")
            ])
            if (reviewsRes?.success && reviewsRes.data) {
                setReviews(reviewsRes.data)
            }
            if (reportsRes?.success && reportsRes.data) {
                setReports(reportsRes.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        markByEvent("new_review")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelectReview = (r: Review) => {
        setSelectedReview(r)
        setSelectedReport(null)
        setHideReasonOptionsOpen(false)
        setSelectedHideReason("")
    }

    const handleSelectReport = (report: ReviewReport) => {
        setSelectedReport(report)
        // If the backend populated review_id correctly, use it as selectedReview
        setSelectedReview(report.review_id as Review)
        setAdminNotes("")
    }

    const toggleVisibility = async (id: string, currentVisibility: boolean) => {
        if (currentVisibility && !selectedHideReason && !hideReasonOptionsOpen) {
            setHideReasonOptionsOpen(true)
            return
        }

        if (currentVisibility && hideReasonOptionsOpen && !selectedHideReason) {
            showToast({ type: "warning", message: "Please select a hide reason." })
            return
        }

        setActionLoading(true)
        try {
            await patch(`/reviews/admin/${id}/visibility`, {
                visibility: !currentVisibility,
                reason: currentVisibility ? selectedHideReason : undefined
            })
            setHideReasonOptionsOpen(false)
            setSelectedHideReason("")

            // Refresh local selection silently to avoid re-layout jump
            if (selectedReview && selectedReview._id === id) {
                setSelectedReview({ ...selectedReview, visibility: !currentVisibility, hide_reason: currentVisibility ? selectedHideReason : undefined })
            }

            // Re-fetch list quietly
            if (viewMode === "all" || viewMode === "ai_flagged") {
                const res = await get<Review[]>("/reviews/admin/list")
                if (res?.success && res.data) setReviews(res.data)
            }
            showToast({ type: "success", message: `Review visibility updated successfully` })
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "Failed to update visibility" })
        } finally {
            setActionLoading(false)
        }
    }



    return (
        <PageContainer className="flex flex-col h-[calc(100vh-100px)] !space-y-6">
            <SectionHeader
                title="Review Moderation"
                action={
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "all" | "flagged" | "ai_flagged")} className="w-[450px]">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg">
                            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:text-white relative inline-flex items-center gap-1.5 px-3">
                                All
                                {reviews.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 dark:bg-neutral-600 text-white text-[10px] font-bold leading-none">
                                        {reviews.length > 99 ? "99+" : reviews.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="flagged" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:text-white relative inline-flex items-center gap-1.5 px-3">
                                Reports
                                {reports.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none">
                                        {reports.length > 99 ? "99+" : reports.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="ai_flagged" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:text-white relative inline-flex items-center gap-1.5 px-3">
                                AI Flagged
                                {reviews.filter(r => r.ai_flagged).length > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none">
                                        {reviews.filter(r => r.ai_flagged).length > 99 ? "99+" : reviews.filter(r => r.ai_flagged).length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                }
            />

            <Card className="flex-1 overflow-hidden flex flex-col lg:flex-row p-0 min-h-0 bg-white dark:bg-neutral-900 shadow-sm border-slate-200 dark:border-neutral-800">
                {/* Left Panel: List */}
                <div className="w-full lg:w-[450px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800 shrink-0 bg-slate-50 dark:bg-neutral-950/50">
                    <div className="p-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 font-semibold text-sm text-slate-800 dark:text-white shrink-0 shadow-sm z-10">
                        {viewMode === "all" ? "Review Catalog" : viewMode === "ai_flagged" ? "AI Flagged Reviews" : "Pending Flagged Reports"}
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {loading ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-20 rounded-lg bg-slate-200 animate-pulse" />
                                ))}
                            </div>
                        ) : viewMode === "all" || viewMode === "ai_flagged" ? (
                            (() => {
                                const displayReviews = viewMode === "ai_flagged" ? reviews.filter(r => r.ai_flagged) : reviews;
                                if (displayReviews.length === 0) return <div className="text-slate-500 text-sm text-center py-6">No reviews in this category.</div>;
                                return displayReviews.map(r => (
                                    <button
                                        key={r._id}
                                        onClick={() => handleSelectReview(r)}
                                        className={cn(
                                            "w-full text-left p-4 border-b border-slate-100 dark:border-neutral-800 transition-all hover:bg-slate-100/50 dark:hover:bg-white/5 flex flex-col gap-2",
                                            selectedReview?._id === r._id && "bg-violet-50 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/10 border-l-2 border-l-violet-600 border-b-violet-100 dark:border-b-neutral-800"
                                        )}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div className="font-semibold text-sm text-slate-900 dark:text-white truncate pr-2">{r.user_id?.name || 'Unknown User'}</div>
                                            <div className="flex items-center gap-1 shrink-0 text-amber-500 font-bold text-xs">
                                                {r.average_rating} <span className="text-slate-400 dark:text-neutral-500 font-normal">/ 5</span>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-slate-500 dark:text-neutral-400">#{r._id.slice(-6)} • {new Date(r.created_at).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-medium transition border",
                                                r.visibility
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                            )}>
                                                {r.visibility ? 'Visible' : 'Hidden'}
                                            </div>
                                            {r.report_count ? <div className="bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-medium">{r.report_count} flags</div> : null}
                                            {r.ai_flagged && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                            {r.adminActionRequired && <ShieldAlert className="h-3 w-3 text-orange-500" />}
                                        </div>
                                    </button>
                                ));
                            })()
                        ) : (
                            reports.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No open reports.</div> : reports.map(report => {
                                const r = report.review_id;
                                return (
                                    <button
                                        key={report._id}
                                        onClick={() => handleSelectReport(report)}
                                        className={cn(
                                            "w-full text-left p-4 border-b border-slate-100 dark:border-neutral-800 transition-all hover:bg-slate-100/50 dark:hover:bg-white/5 flex flex-col gap-2",
                                            selectedReport?._id === report._id && "bg-violet-50 dark:bg-white/10 hover:bg-violet-50 dark:hover:bg-white/10 border-l-2 border-l-violet-600 border-b-violet-100 dark:border-b-neutral-800"
                                        )}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div className="font-semibold text-sm text-slate-900 dark:text-white truncate pr-2">By: {report.reported_by?.name || 'Unknown'}</div>
                                            <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 rounded-full px-2 py-0.5 text-xs font-medium uppercase shrink-0">{report.reason}</div>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-neutral-400 font-mono">Rpt: #{report._id.slice(-6)} • {new Date(report.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium text-slate-700 dark:text-neutral-300">Target Visibility:</span>
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-medium transition border",
                                                r && r.visibility
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                            )}>
                                                {r && r.visibility ? 'Visible' : 'Hidden'}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Details */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-neutral-900">
                    <div className="border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-4 px-6 shrink-0 flex flex-row items-center justify-between">
                        <span className="text-base font-semibold text-slate-800 dark:text-white">Detailed Inspector</span>
                        {selectedReview && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-700 dark:text-neutral-400">Status:</span>
                                <div className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition border uppercase tracking-widest",
                                    selectedReview.visibility
                                        ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
                                        : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20"
                                )}>
                                    {selectedReview.visibility ? 'PUBLIC' : 'HIDDEN'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-0 overflow-y-auto flex-1 relative bg-slate-50/30">
                        {!selectedReview && !selectedReport ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <FileText className="h-12 w-12 mb-4 text-slate-300" />
                                <p className="text-sm font-medium">Select a review from the list to inspect</p>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
                                {/* Review Core Content */}
                                {selectedReview && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                    Review #{selectedReview._id.slice(-6)}
                                                    {selectedReview.adminActionRequired && (
                                                        <Badge variant="danger" className="text-[10px] uppercase font-bold px-2 py-0.5 shadow-none">
                                                            Action Required
                                                        </Badge>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">Written on {new Date(selectedReview.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tight text-amber-500">{selectedReview.average_rating} <span className="text-sm text-slate-400 dark:text-neutral-500 font-semibold">/ 5</span></div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl shadow-sm p-4 relative">
                                            <div className="absolute top-0 left-6 w-8 h-8 -mt-4 bg-slate-100 dark:bg-neutral-700 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-neutral-600">
                                                <FileText className="h-4 w-4 text-slate-500 dark:text-neutral-300" />
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-neutral-200 leading-relaxed mt-2">
                                                {selectedReview.comment
                                                    ? <>&quot;{selectedReview.comment}&quot;</> : selectedReport?.description
                                                        ? <span className="italic text-slate-500 dark:text-neutral-400">Reporter context: &quot;{selectedReport.description}&quot;</span>
                                                        : <span className="italic text-slate-400">No written comment provided.</span>
                                                }
                                            </p>
                                            {selectedReview.images && selectedReview.images.length > 0 && (
                                                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-neutral-700 overflow-x-auto pb-2">
                                                    {selectedReview.images.map(img => (
                                                        <a key={img.image_id} href={img.image_url} target="_blank" rel="noreferrer" className="shrink-0 flex-none group">
                                                            <div className="h-24 w-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm group-hover:opacity-80 transition-opacity">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={img.thumbnail_url || img.image_url} alt="Review attachment" className="h-full w-full object-cover" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Moderation Badges */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedReview.ai_processed !== false && (
                                                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm flex flex-col">
                                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 mb-2">AI Trust Score</div>
                                                    <div className="flex items-center gap-2 mt-auto">
                                                        <span className={cn(
                                                            "text-2xl font-black tracking-tight",
                                                            (selectedReview.ai_trust_score || 0) < 0.5 ? "text-red-600" : "text-green-600"
                                                        )}>
                                                            {selectedReview.ai_trust_score !== undefined ? `${(selectedReview.ai_trust_score * 100).toFixed(0)}%` : 'N/A'}
                                                        </span>
                                                        {selectedReview.ai_flagged && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm flex flex-col">
                                                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 mb-2">Community Reports</div>
                                                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-auto">{selectedReview.report_count || 0}</div>
                                            </div>
                                        </div>

                                        {/* Flag Reasons/Meta */}
                                        {(selectedReview.ai_flag_reasons?.length || selectedReview.hide_reason || selectedReview.adminActionReason) && (
                                            <div className="space-y-3 mt-4 bg-slate-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                                                {selectedReview.hide_reason && (
                                                    <div className="flex gap-2 text-sm items-center">
                                                        <span className="font-semibold text-slate-900 dark:text-white">Hide Reason:</span>
                                                        <Badge variant="danger" className="font-medium shadow-none">{selectedReview.hide_reason}</Badge>
                                                    </div>
                                                )}
                                                {selectedReview.adminActionReason && (
                                                    <div className="flex gap-2 text-sm items-center">
                                                        <span className="font-semibold text-slate-900 dark:text-white">Audit Trigger:</span>
                                                        <span className="text-orange-600 font-medium">{selectedReview.adminActionReason}</span>
                                                    </div>
                                                )}
                                                {selectedReview.ai_flag_reasons && selectedReview.ai_flag_reasons.length > 0 && (
                                                    <div className="flex gap-2 text-sm items-start">
                                                        <span className="font-semibold text-slate-900 dark:text-white shrink-0 mt-0.5">AI Flags:</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {selectedReview.ai_flag_reasons.map((f, i) => (
                                                                <span key={i} className="bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 rounded-full px-2 py-0.5 text-xs font-medium uppercase">{f}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Report Resolution Block (If viewed from Flagged) */}
                                {selectedReport && (
                                    <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <ShieldAlert className="h-5 w-5 text-orange-500" />
                                            Active Report Details
                                        </h3>
                                        <div className="bg-orange-50/50 border border-orange-200 shadow-sm rounded-xl p-6 space-y-4">
                                            <div className="flex gap-2 text-sm">
                                                <span className="font-semibold text-slate-900 min-w-[100px]">Reported By:</span>
                                                <span className="text-slate-700">{selectedReport.reported_by?.name || 'Unknown User'}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm">
                                                <span className="font-semibold text-slate-900 min-w-[100px]">Rule Broken:</span>
                                                <Badge variant="danger" className="uppercase tracking-tight shadow-none">{selectedReport.reason}</Badge>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-4">
                                            <div className="text-sm text-slate-500 italic p-4 text-center">
                                                Resolution actions are currently disabled at the API level.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Persistent Visibility Controls */}
                    {selectedReview && (
                        <div className="bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 p-4 shrink-0 flex flex-col gap-3">
                            {hideReasonOptionsOpen ? (
                                <div className="space-y-3 bg-slate-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                                    <label className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest">Select Hide Reason:</label>
                                    <select
                                        className="w-full text-sm rounded bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 p-2.5 focus:ring-2 focus:ring-violet-600 outline-none text-slate-900 dark:text-white"
                                        value={selectedHideReason}
                                        onChange={e => setSelectedHideReason(e.target.value)}
                                    >
                                        <option value="" disabled>Choose a reason...</option>
                                        {HIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm" onClick={() => setHideReasonOptionsOpen(false)}>Cancel</Button>
                                        <Button size="sm" className="flex-1 shadow-sm font-semibold bg-violet-600 text-white hover:bg-violet-700" onClick={() => toggleVisibility(selectedReview._id, true)} disabled={actionLoading || !selectedHideReason}>
                                            Confirm Hide
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => toggleVisibility(selectedReview._id, selectedReview.visibility)}
                                    disabled={actionLoading}
                                    className={cn(
                                        "w-full font-semibold shadow-sm h-12 text-sm",
                                        selectedReview.visibility
                                            ? "bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"
                                            : "bg-violet-600 text-white hover:bg-violet-700"
                                    )}
                                >
                                    {selectedReview.visibility ? (
                                        <><EyeOff className="mr-2 h-5 w-5" /> Enforce Hide Review</>
                                    ) : (
                                        <><Eye className="mr-2 h-5 w-5" /> Restore Visibility</>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </PageContainer>
    )
}
