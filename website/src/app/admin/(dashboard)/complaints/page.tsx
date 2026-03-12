"use client"

import { useEffect, useState } from "react"
import { get, patch, logAdminAction } from "@/lib/admin/api"
import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Textarea } from "@/components/admin/ui/textarea"
import { ScrollArea } from "@/components/admin/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { useToast } from "@/components/admin/providers/toast-provider"
import { ChevronLeft, ChevronRight, AlertCircle, Clock, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react"
import { PageContainer } from "@/components/admin/ui/page-container"
import { SectionHeader } from "@/components/admin/ui/section-header"
import { cn, getImageUrl } from "@/lib/admin/utils"
import { useNotifications } from "@/hooks/admin/use-notifications"

// Types based on the backend Complaint model
interface ComplaintImage {
    image_url: string
    image_id: string
    thumbnail_url?: string
}

interface UserOrProvider {
    _id: string
    name?: string
    email?: string
}

interface Complaint {
    _id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    booking_id: any
    provider_id: UserOrProvider
    user_id: UserOrProvider
    title: string
    description: string
    category: string
    urgency: 'low' | 'medium' | 'high'
    images: ComplaintImage[]
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
    resolution_notes?: string
    resolved_by?: string
    resolved_at?: string
    assigned_to?: string
    priority: number
    read_only: boolean
    created_at: string
}

type TabType = "active" | "resolved"

export default function ComplaintsPage() {
    const { showToast } = useToast()
    const { markByEvent } = useNotifications()

    // State
    const [activeTab, setActiveTab] = useState<TabType>("active")
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [activeCount, setActiveCount] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const limit = 15

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Forms
    const [resolutionNotes, setResolutionNotes] = useState("")
    const [assigneeId, setAssigneeId] = useState("")
    const [priorityLevel, setPriorityLevel] = useState("0")

    const fetchActiveCount = async () => {
        try {
            const res = await get<Complaint[]>(`/complaints/admin/list?page=1&limit=1`)
            if (res && res.success) {
                setActiveCount(res.pagination?.total || 0)
            }
        } catch (e) {
            console.error("Failed to fetch active count", e)
        }
    }

    const loadComplaints = async (currentPage = page, tab = activeTab) => {
        if (typeof window !== "undefined" && window.location.pathname.includes("/login")) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            let endpoint = ""
            if (tab === "active") {
                endpoint = `/complaints/admin/list?page=${currentPage}&limit=${limit}`
            } else if (tab === "resolved") {
                endpoint = `/complaints/admin/resolved?status=RESOLVED&page=${currentPage}&limit=${limit}`
            }

            const res = await get<Complaint[]>(endpoint)
            if (res && res.success) {
                const fetchedData = res.data || []
                setComplaints(fetchedData)
                setTotal(res.pagination?.total || 0)
                if (tab === "active") setActiveCount(res.pagination?.total || 0)
                setSelectedId(prev => (prev && !fetchedData.find(c => c._id === prev)) ? null : prev)
            } else {
                setComplaints([])
                setTotal(0)
                if (tab === "active") setActiveCount(0)
                setSelectedId(null)
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "Failed to load complaints" })
            setComplaints([])
            setSelectedId(null)
        } finally {
            setLoading(false)
        }
    }

    const reloadSelectedComplaint = async () => {
        try {
            await loadComplaints(page, activeTab)
            if (activeTab !== "active") fetchActiveCount() // Refresh background active count if not already fetched by loadComplaints
        } catch (e) {
            console.error(e)
        }
    }

    const handleTabChange = (newTab: TabType) => {
        setActiveTab(newTab)
        setPage(1)
        setSelectedId(null)
    }

    useEffect(() => {
        loadComplaints(page, activeTab)
        if (activeCount === null) fetchActiveCount()
        markByEvent("New Complaint")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, activeTab])

    const selectedComplaint = complaints.find(c => c._id === selectedId) || null

    // Reset forms when selection changes
    useEffect(() => {
        if (selectedComplaint) {
            setResolutionNotes("")
            setAssigneeId(selectedComplaint.assigned_to || "")
            setPriorityLevel(selectedComplaint.priority?.toString() || "0")
        }
    }, [selectedComplaint])

    const handleResolveReject = async (status: 'RESOLVED' | 'REJECTED') => {
        if (!selectedId) return
        if (!resolutionNotes.trim()) {
            showToast({ type: "warning", message: "Resolution notes are required." })
            return
        }

        setIsActionLoading(true)
        try {
            const res = await patch(`/complaints/${selectedId}/resolve`, {
                status,
                resolution_notes: resolutionNotes.trim()
            })
            if (res && res.success) {
                showToast({ type: "success", message: `Complaint ${status.toLowerCase()} successfully` })
                logAdminAction(`Complaint ${status === 'RESOLVED' ? 'Resolved' : 'Rejected'}`, `Complaint ID ${selectedId} was marked as ${status.toLowerCase()}.`)
                await reloadSelectedComplaint()
            } else {
                showToast({ type: "error", message: res?.message || "Action failed" })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An error occurred" })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedId) return
        setIsActionLoading(true)
        try {
            const payload: any = { priority: parseInt(priorityLevel) }
            if (assigneeId.trim()) {
                payload.assigned_to = assigneeId.trim()
            }

            const res = await patch(`/complaints/${selectedId}/assign`, payload)
            if (res && res.success) {
                showToast({ type: "success", message: "Assignment updated" })
                await reloadSelectedComplaint()
            } else {
                showToast({ type: "error", message: res?.message || "Action failed" })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An error occurred" })
        } finally {
            setIsActionLoading(false)
        }
    }

    const totalPages = Math.ceil(total / limit)

    return (
        <PageContainer className="flex flex-col h-[calc(100vh-100px)] !space-y-6">
            <SectionHeader
                title="Complaints"
                action={
                    <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as TabType)} className="w-[240px]">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                            <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                                Active
                                {activeCount !== null && (
                                    <span className="bg-violet-100 text-violet-700 py-0.5 px-2 rounded-full text-xs font-semibold">
                                        {activeCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="resolved" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Resolved</TabsTrigger>
                        </TabsList>
                    </Tabs>
                }
            />

            <Card className="flex-1 overflow-hidden flex flex-col lg:flex-row p-0 min-h-0 bg-white shadow-sm border-slate-200">
                {/* Left Panel: List */}
                <div className="w-full lg:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0 bg-slate-50">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-3">
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={`skeleton-${i}`} className="h-[100px] rounded-lg bg-slate-200 animate-pulse" />
                                    ))}
                                </div>
                            ) : complaints.length === 0 ? (
                                <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
                                    No complaints in this category.
                                </div>
                            ) : (
                                complaints.map((c, idx) => (
                                    <button
                                        key={c._id || `complaint-${idx}`}
                                        onClick={() => setSelectedId(c._id)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedId === c._id
                                            ? 'bg-violet-50 border-violet-200 shadow-sm ring-1 ring-violet-500'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="font-semibold text-sm truncate pr-2 text-slate-900">{c.title}</div>
                                            <Badge variant={c.urgency === 'high' ? 'danger' : c.urgency === 'medium' ? 'warning' : 'default'} className="shrink-0 text-[10px] px-1.5 leading-none py-0.5 uppercase shadow-none">
                                                {c.urgency}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant={c.status === 'OPEN' ? 'warning' : c.status === 'RESOLVED' ? 'success' : c.status === 'REJECTED' ? 'default' : 'primary'} className="text-[10px] shadow-none">
                                                {c.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] bg-white text-slate-500 border-dashed shadow-none">
                                                {c.category.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs text-slate-500 w-full">
                                            <div className="flex justify-between w-full">
                                                <span className="truncate max-w-[150px]">P: {c.provider_id?.name || 'Unknown'}</span>
                                                <span className="shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
                            <span className="text-xs text-slate-500 font-medium">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                                    disabled={page <= 1 || loading}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                                    disabled={page >= totalPages || loading}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Details */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    {selectedComplaint ? (
                        <ScrollArea className="flex-1">
                            <div className="p-6 md:p-8 space-y-6">
                                {/* Header */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                        <span className="uppercase tracking-wider font-semibold">{selectedComplaint.category.replace(/_/g, ' ')}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(selectedComplaint.created_at).toLocaleString()}</span>
                                        <span>•</span>
                                        <span className="font-mono">{selectedComplaint._id}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">{selectedComplaint.title}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant={selectedComplaint.status === 'OPEN' ? 'warning' : selectedComplaint.status === 'IN_PROGRESS' ? 'primary' : selectedComplaint.status === 'RESOLVED' ? 'success' : 'default'} className="text-sm px-3 py-1 shadow-none">
                                            {selectedComplaint.status}
                                        </Badge>
                                        <Badge variant={selectedComplaint.urgency === 'high' ? 'danger' : selectedComplaint.urgency === 'medium' ? 'warning' : 'default'} className="text-sm px-3 py-1 capitalize shadow-none">
                                            {selectedComplaint.urgency} Priority
                                        </Badge>
                                        <Badge variant="outline" className="text-sm px-3 py-1 bg-white border-dashed text-slate-600 shadow-none">
                                            Assignee: {selectedComplaint.assigned_to ? selectedComplaint.assigned_to : 'Unassigned'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-slate-900 mb-3 text-base">
                                        <AlertCircle className="h-4 w-4 text-slate-400" />
                                        Issue Description
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                            {selectedComplaint.description}
                                        </p>

                                        {/* Images */}
                                        {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-slate-200 font-semibold">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                                    <ImageIcon className="h-4 w-4" /> Attached Images
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedComplaint.images.map((img, idx) => (
                                                        <a key={img.image_id || `img-${idx}`} href={img.image_url} target="_blank" rel="noreferrer" className="shrink-0 block">
                                                            <div className="h-24 w-24 rounded-lg bg-white border border-slate-200 overflow-hidden hover:opacity-80 transition-opacity shadow-sm">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={getImageUrl(img.thumbnail_url || img.image_url)} alt="Proof" className="w-full h-full object-cover" />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Relations */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="shadow-none border-slate-200">
                                        <CardHeader className="p-4 pb-0 opacity-70">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">User Information</p>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 text-sm">
                                            {selectedComplaint.user_id ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-900">{selectedComplaint.user_id.name || 'No Name'}</span>
                                                    <span className="text-slate-500">{selectedComplaint.user_id.email || 'No Email'}</span>
                                                    <span className="font-mono text-xs text-slate-400 mt-1">ID: {selectedComplaint.user_id._id}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">User data unavailable</span>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-none border-slate-200">
                                        <CardHeader className="p-4 pb-0 opacity-70">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Provider Information</p>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 text-sm">
                                            {selectedComplaint.provider_id ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-900">{selectedComplaint.provider_id.name || 'No Name'}</span>
                                                    <span className="text-slate-500">{selectedComplaint.provider_id.email || 'No Email'}</span>
                                                    <span className="font-mono text-xs text-slate-400 mt-1">ID: {selectedComplaint.provider_id._id}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Provider data unavailable</span>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-none border-slate-200 md:col-span-2">
                                        <CardHeader className="p-4 pb-0 opacity-70">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Booking Info</p>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 text-sm font-mono text-slate-600">
                                            ID: {typeof selectedComplaint.booking_id === 'object' ? selectedComplaint.booking_id?._id : selectedComplaint.booking_id}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Resolution Details (Read Only) */}
                                {selectedComplaint.status !== 'OPEN' && selectedComplaint.status !== 'IN_PROGRESS' && (
                                    <div className={cn(
                                        "p-6 rounded-xl border shadow-sm",
                                        selectedComplaint.status === 'RESOLVED' ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"
                                    )}>
                                        <div className="flex items-center gap-2 font-semibold mb-3">
                                            {selectedComplaint.status === 'RESOLVED' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-slate-500" />}
                                            <span className={selectedComplaint.status === 'RESOLVED' ? "text-green-800" : "text-slate-800"}>
                                                {selectedComplaint.status === 'RESOLVED' ? 'Resolution Details' : 'Rejection Details'}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "text-sm whitespace-pre-wrap",
                                            selectedComplaint.status === 'RESOLVED' ? "text-green-900" : "text-slate-700"
                                        )}>
                                            {selectedComplaint.resolution_notes || 'No notes provided.'}
                                        </div>
                                        <div className={cn(
                                            "flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t text-xs",
                                            selectedComplaint.status === 'RESOLVED' ? "border-green-200/50 text-green-700" : "border-slate-200 text-slate-500"
                                        )}>
                                            <span><span className="font-semibold">Resolved By (Admin ID):</span> {selectedComplaint.resolved_by || 'System'}</span>
                                            <span><span className="font-semibold">Resolved At:</span> {selectedComplaint.resolved_at ? new Date(selectedComplaint.resolved_at).toLocaleString() : 'Unknown'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Editing Controls (Only for active complaints) */}
                                {(selectedComplaint.status === 'OPEN' || selectedComplaint.status === 'IN_PROGRESS') && !selectedComplaint.read_only && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Action / Resolution Box */}
                                        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <h3 className="text-base font-semibold text-slate-900 mb-1">Take Action</h3>
                                            <p className="text-sm text-slate-500 mb-4">Resolve or reject this complaint.</p>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-900">Resolution Notes <span className="text-red-500">*</span></label>
                                                    <Textarea
                                                        placeholder="Explain how this issue was handled..."
                                                        className="min-h-[100px] resize-none border-slate-200 bg-white"
                                                        value={resolutionNotes}
                                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                        disabled={isActionLoading || !resolutionNotes.trim()}
                                                        onClick={() => handleResolveReject('RESOLVED')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Resolve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                                                        disabled={isActionLoading || !resolutionNotes.trim()}
                                                        onClick={() => handleResolveReject('REJECTED')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assignment Box */}
                                        <div className="p-6 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
                                            <h3 className="text-base font-semibold text-slate-900 mb-1">Assignment & Priority</h3>
                                            <p className="text-sm text-slate-500 mb-4">Update tracking configuration.</p>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-900">Assignee ID (Admin)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Admin UUID..."
                                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={assigneeId}
                                                        onChange={(e) => setAssigneeId(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-900">Numeric Priority</label>
                                                    <Select value={priorityLevel} onValueChange={setPriorityLevel}>
                                                        <SelectTrigger className="bg-white border-slate-200">
                                                            <SelectValue placeholder="Select priority..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-neutral-900 z-50">
                                                            <SelectItem value="0">Normal (0)</SelectItem>
                                                            <SelectItem value="1">Elevated (1)</SelectItem>
                                                            <SelectItem value="2">High (2)</SelectItem>
                                                            <SelectItem value="3">Critical (3)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="pt-2">
                                                    <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" disabled={isActionLoading} onClick={handleAssign}>
                                                        Update Tracking
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-4">
                            <AlertCircle className="h-16 w-16 opacity-50" strokeWidth={1} />
                            <p className="text-lg font-medium text-slate-500">Select a complaint to view details</p>
                            <p className="text-sm max-w-sm text-center">Manage resolution, assign admins, and communicate with users seamlessly from this interface.</p>
                        </div>
                    )}
                </div>
            </Card>
        </PageContainer>
    )
}
