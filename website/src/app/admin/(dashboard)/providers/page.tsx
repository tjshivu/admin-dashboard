/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api, get, patch, post, logAdminAction } from "@/lib/admin/api"
import { useTrustTrendGraphic, useProviderPerformanceMetrics } from "@/hooks/admin/use-analytics-hooks" // trend
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent } from "@/components/admin/ui/card"
import { X, Search, Download, FileText, AlertTriangle } from "lucide-react"
import { cn, getImageUrl } from "@/lib/admin/utils"
import { useToast } from "@/components/admin/providers/toast-provider"
import { PageContainer } from "@/components/admin/ui/page-container"
import { SectionHeader } from "@/components/admin/ui/section-header"
import { Badge } from "@/components/admin/ui/badge"
import { GridSystem } from "@/components/admin/ui/grid-system"
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmM2Y0ZjYiLz48cGF0aCBkPSJNNTAsMzAgTDUwLDcwIE0zMCw1MCBMNzAsNTAiIHN0cm9rZT0iI2QxZDVmNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=";

interface ProviderDocument {
    _id?: string
    document_type?: string
    document_url: string
    verified?: boolean
    rejected?: boolean
    rejection_reason?: string
}

interface AadhaarInfo {
    reference_id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: any
}

interface Provider {
    _id: string
    name: string
    email: string
    phone: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: any
    status: string
    trust_status?: string
    onboardingStep?: string
    active?: boolean
    searchable?: boolean
    hygiene_checklist?: string[]
    createdAt: string
    deletedAt?: string
    deletedReason?: string
    documents?: ProviderDocument[]
    aadhaarInfo?: AadhaarInfo
    rejection_reasons?: string[]
    delisting_warning_start?: string | null
}

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("All Providers")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [detailTab, setDetailTab] = useState("Basic Info")
    const [searchQuery, setSearchQuery] = useState("")
    const { showToast } = useToast()

    // Close drawer on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedProvider(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const { data: trendData } = useTrustTrendGraphic(selectedProvider?._id || "", 30)
    const { data: perfMetrics, isLoading: perfLoading } = useProviderPerformanceMetrics(selectedProvider?._id || "", 30)

    const loadProviders = async () => {
        setLoading(true)
        try {
            let activeProviders: Provider[] = []

            const resAdmin = await get<Provider[]>("/admin/providers")
            if (resAdmin && resAdmin.success) activeProviders = resAdmin.data

            setProviders(activeProviders)
            setSelectedIds(new Set())

            setSelectedProvider(prev => {
                if (!prev) return null;
                const updated = activeProviders.find(p => p._id === prev._id);
                return updated ? { ...prev, ...updated } : prev;
            });
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const [actionLoading, setActionLoading] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)
    const [providerServices, setProviderServices] = useState<any[]>([])
    const [servicesLoading, setServicesLoading] = useState(false)

    useEffect(() => {
        if (!selectedProvider?._id || detailTab !== "Services") {
            return
        }
        const fetchServices = async () => {
            setServicesLoading(true)
            try {
                const servicesRes = await get<any>(`/admin/providers/${selectedProvider._id}/services`)
                if (servicesRes?.success) setProviderServices(servicesRes.data || [])
            } catch (e) {
                console.error("Failed to fetch services", e)
            } finally {
                setServicesLoading(false)
            }
        }
        fetchServices()
    }, [selectedProvider?._id, detailTab])

    const fetchProviderDetail = async (id: string) => {
        setDetailLoading(true)
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await get<any>(`/admin/providers/${id}`)
            if (res && res.success && res.data) {
                setSelectedProvider(prev => prev && prev._id === id ? { ...prev, ...res.data } : res.data)
                setProviders(prev => prev.map(p => p._id === id ? { ...p, ...res.data } : p))
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "Failed to load provider details" })
        } finally {
            setDetailLoading(false)
        }
    }

    const handleApprove = async (id: string) => {
        if (!confirm("Are you sure you want to approve this provider?")) return
        setActionLoading(true)
        try {
            const res = await post(`/admin/providers/${id}/approve`, {})
            if (res?.success) {
                showToast({ type: "success", message: "Provider approved successfully" })
                logAdminAction("Provider Approved", `Provider ID ${id} was approved.`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to approve provider" })
            }
        } catch (e: any) {
            console.error("[handleApprove]", e)
            showToast({ type: "error", message: e?.message || "An error occurred while approving" })
        } finally {
            setActionLoading(false)
        }
    }



    const handleReject = async (id: string) => {
        const reason = prompt("Please enter a reason for rejection:")
        if (reason === null) return
        if (reason.trim() === "") {
            showToast({ type: "warning", message: "Rejection reason is required." })
            return
        }
        setActionLoading(true)
        try {
            const res = await post(`/admin/providers/${id}/reject`, { reject_reason: reason.trim() })
            if (res?.success) {
                showToast({ type: "success", message: "Provider rejected successfully" })
                logAdminAction("Provider Rejected", `Provider ID ${id} was rejected. Reason: ${reason.trim()}`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to reject provider" })
            }
        } catch (e: any) {
            console.error("[handleReject]", e)
            showToast({ type: "error", message: e?.message || "An error occurred while rejecting" })
        } finally {
            setActionLoading(false)
        }
    }


    const handleViewDocument = async (e: React.MouseEvent, docUrl: string) => {
        e.preventDefault()
        try {
            let fetchUrl = docUrl
            if (docUrl.includes('/uploads/docs/')) {
                // Always use the Next.js proxy (/api) so the auth cookie is sent
                // on the same origin. NEXT_PUBLIC_API_URL is cross-domain and
                // browsers strip cookies on cross-origin requests.
                const parts = docUrl.split('/uploads/docs/')
                const docPath = parts[1].split('?')[0]
                // Route through proxy: include /admin/ prefix if not already present
                const adminPath = docPath.startsWith('admin/') ? docPath : `admin/${docPath}`
                fetchUrl = `/api/uploads/docs/${adminPath}`

                showToast({ type: "info", message: "Loading secure document..." })

                const res = await fetch(fetchUrl, {
                    method: "GET",
                    credentials: "include"
                })

                if (!res.ok) throw new Error("Could not fetch document")

                const blob = await res.blob() // format-fix
                const type = blob.type // format-fix

                if (type === "application/pdf" || type.startsWith("image/")) { // format-fix
                    const objectUrl = window.URL.createObjectURL(blob)
                    window.open(objectUrl, '_blank')
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000)
                } else {
                    window.open(fetchUrl, '_blank')
                }
            } else {
                window.open(docUrl, '_blank')
            }
        } catch (error) {
            console.error("Failed to view document", error)
            showToast({ type: "error", message: "Failed to open document securely." })
        }
    }

    const handleSuspend = async (id: string) => {
        if (!confirm("Are you sure you want to suspend this provider?")) return
        setActionLoading(true)
        try {
            const res = await post(`/admin/providers/${id}/suspend`, {})
            if (res?.success) {
                showToast({ type: "success", message: "Provider suspended successfully" })
                logAdminAction("Provider Suspended", `Provider ID ${id} was suspended.`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to suspend provider" })
            }
        } catch (e: any) {
            console.error("[handleSuspend]", e)
            showToast({ type: "error", message: e?.message || "An error occurred while suspending" })
        } finally {
            setActionLoading(false)
        }
    }



    useEffect(() => {
        loadProviders()
    }, [])

    const tabs = ["All Providers", "Active", "Pending", "Suspended"]

    // Tab filter maps to trust_status values from backend
    const tabFilteredProviders = providers.filter(p => {
        if (activeTab === "Active") return p.trust_status === "VERIFIED" || p.trust_status === "TRUSTED"
        if (activeTab === "Pending") return p.trust_status === "PENDING_VERIFICATION" || p.trust_status === "UNLISTED"
        if (activeTab === "Suspended") return p.trust_status === "SUSPENDED" || p.trust_status === "REJECTED"
        return true
    })

    // Search filter on name, email, phone
    const q = searchQuery.trim().toLowerCase()
    const filteredProviders = q
        ? tabFilteredProviders.filter(p =>
            (p.name || "").toLowerCase().includes(q) ||
            (p.email || "").toLowerCase().includes(q) ||
            (p.phone || "").toLowerCase().includes(q)
        )
        : tabFilteredProviders

    // Tab counts
    const tabCounts: Record<string, number> = {
        "All Providers": providers.length,
        "Active": providers.filter(p => p.trust_status === "VERIFIED" || p.trust_status === "TRUSTED").length,
        "Pending": providers.filter(p => p.trust_status === "PENDING_VERIFICATION" || p.trust_status === "UNLISTED").length,
        "Suspended": providers.filter(p => p.trust_status === "SUSPENDED" || p.trust_status === "REJECTED").length,
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredProviders.map(p => p._id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds)
        if (checked) newSet.add(id)
        else newSet.delete(id)
        setSelectedIds(newSet)
    }

    const exportCSV = () => {
        const rows = filteredProviders
        if (rows.length === 0) {
            showToast({ type: "warning", message: "No providers to export." })
            return
        }
        const headers = ["Name", "Email", "Phone", "Trust Status", "Onboarding Step", "Joined Date"]
        const csvRows = [
            headers.join(","),
            ...rows.map(p => [
                `"${(p.name || "").replace(/"/g, '""')}"`,
                `"${(p.email || "").replace(/"/g, '""')}"`,
                `"${(p.phone || "").replace(/"/g, '""')}"`,
                `"${p.trust_status || ""}"`,
                `"${(p.onboardingStep || "").replace(/_/g, ' ')}"`,
                `"${new Date(p.createdAt).toLocaleDateString('en-GB')}"`
            ].join(","))
        ].join("\n")
        const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `providers_${activeTab.toLowerCase().replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <PageContainer>
            <SectionHeader
                title={`Providers ${providers.length > 0 ? `(${providers.length})` : ''}`}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportCSV}
                        className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/10"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                        {filteredProviders.length > 0 && (
                            <span className="ml-1.5 text-[10px] font-black bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                {filteredProviders.length}
                            </span>
                        )}
                    </Button>
                }
            />

            {/* Provider Table — always full width */}
            <div>
                {/* Main Table Card */}
                <Card className="w-full overflow-hidden border-slate-200 dark:border-neutral-800">
                    {/* Tabs */}
                    <div className="px-6 flex items-center gap-6 border-b border-slate-200 dark:border-neutral-800">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSearchQuery("") }}
                                className={cn(
                                    "py-4 text-sm font-semibold transition-all relative border-b-2 flex items-center gap-2",
                                    activeTab === tab ? "text-violet-600 border-violet-600" : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border-transparent"
                                )}
                            >
                                {tab}
                                {tabCounts[tab] > 0 && (
                                    <span className={cn(
                                        "text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                                        activeTab === tab
                                            ? "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
                                            : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400"
                                    )}>
                                        {tabCounts[tab]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email or phone..."
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm shadow-sm dark:text-white"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table Content */}
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/20 hover:bg-slate-50/50 dark:hover:bg-neutral-900/20">
                                        <TableHead className="font-semibold text-slate-500 dark:text-neutral-400 h-10 pl-6">Provider Info</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-neutral-400 h-10">Joined Date</TableHead>
                                        <TableHead className="font-semibold text-slate-500 dark:text-neutral-400 h-10">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center text-slate-500">Loading specific data...</TableCell>
                                        </TableRow>
                                    ) : filteredProviders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center text-slate-500">No providers found in this category</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProviders.map((p) => (
                                            <TableRow
                                                key={p._id}
                                                className={cn(
                                                    "border-b border-slate-100 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer",
                                                    selectedProvider?._id === p._id && "bg-slate-50 dark:bg-white/10",
                                                    p.status === 'deleted' ? 'opacity-70' : ''
                                                )}
                                                onClick={() => {
                                                    if (selectedProvider?._id !== p._id) {
                                                        setSelectedProvider(p)
                                                        fetchProviderDetail(p._id)
                                                    }
                                                }}
                                            >
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex flex-col">
                                                        <span className={cn("font-medium text-sm", p.status === 'deleted' ? 'text-slate-500 line-through' : 'text-slate-900')}>{p.name}</span>
                                                        <span className="text-xs text-slate-500">{p.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {new Date(p.createdAt).toLocaleDateString('en-GB')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={
                                                            p.trust_status === 'VERIFIED' || p.trust_status === 'TRUSTED' ? 'success' :
                                                                p.trust_status === 'PENDING_VERIFICATION' || p.trust_status === 'UNLISTED' ? 'warning' :
                                                                    p.trust_status === 'SUSPENDED' || p.trust_status === 'REJECTED' ? 'danger' : 'default'
                                                        } className={p.status === 'deleted' ? 'bg-slate-100 text-slate-500 font-normal shadow-none' : ''}>
                                                            {p.trust_status || p.status}
                                                        </Badge>
                                                        {p.delisting_warning_start && (
                                                            <div className="flex items-center text-rose-500" title="Grace Period: Delisting Warning Active">
                                                                <AlertTriangle className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Slide-over Drawer */}
            {selectedProvider && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300"
                        onClick={() => setSelectedProvider(null)}
                    />
                    {/* Drawer panel */}
                    <div className="fixed top-0 right-0 h-full w-full max-w-[660px] z-50 flex flex-col bg-white dark:bg-neutral-900 shadow-2xl border-l border-slate-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
                        {/* Drawer header */}
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-neutral-800 flex items-start justify-between gap-4 shrink-0">
                            <div>
                                <h3 className={cn(
                                    "text-lg font-bold",
                                    selectedProvider.status === 'deleted'
                                        ? 'line-through text-slate-400'
                                        : 'text-slate-900 dark:text-white'
                                )}>
                                    {selectedProvider.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-neutral-400 mt-0.5">{selectedProvider.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedProvider(null)}
                                className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-white shrink-0 mt-0.5"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Tab strip */}
                        <div className="px-4 flex items-center border-b border-slate-200 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-900 w-full overflow-x-hidden"> {/* nav-fix */}
                            <div className="flex flex-wrap gap-2 py-2"> {/* nav-fix */}
                                {["Basic Info", "Documents", "Services", "Status", "Activity", "Trust & Risk", "Intent Insights"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setDetailTab(tab)}
                                        className={cn(
                                            "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap", // nav-fix
                                            detailTab === tab
                                                ? "text-violet-600 border-violet-600"
                                                : "text-slate-500 hover:text-slate-800 dark:hover:text-white border-transparent"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {detailTab === "Basic Info" && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-slate-500 font-medium">Phone</span>
                                        <span className="text-slate-900">{selectedProvider.phone || '—'}</span>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-slate-500 font-medium">Category</span>
                                        <span className="text-slate-900">{selectedProvider.category?.name || '—'}</span>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-slate-500 font-medium">Provider ID</span>
                                        <span className="text-slate-900 break-all">{selectedProvider._id}</span>
                                    </div>
                                    {selectedProvider.aadhaarInfo && (
                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                            <span className="text-slate-500 font-medium whitespace-nowrap">Aadhaar Ref</span>
                                            <span className="text-slate-900 break-all">{selectedProvider.aadhaarInfo.reference_id}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {detailTab === "Documents" && (
                                <div className="space-y-4">
                                    {detailLoading ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-neutral-800 animate-pulse" />
                                            ))}
                                        </div>
                                    ) : (() => {
                                        const docs: ProviderDocument[] = selectedProvider.documents || [];
                                        if (docs.length === 0) {
                                            return (
                                                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                                                    <FileText className="h-8 w-8 text-slate-300" />
                                                    <p className="text-sm font-medium">No documents uploaded yet.</p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="grid grid-cols-2 gap-3">
                                                {docs.map((doc, idx) => {
                                                    const url = getImageUrl(doc.document_url);
                                                    const isPdf = !!(doc as any).metadata?.gridfs_id || (url && (url.includes('/uploads/docs/') || url.toLowerCase().endsWith('.pdf')));
                                                    const name = (doc as any).metadata?.originalname
                                                        || (doc.document_type || '').replaceAll('_', ' ')
                                                        || `Document ${idx + 1}`;

                                                    return (
                                                        <a
                                                            key={(doc as any)._id || idx}
                                                            href={url}
                                                            onClick={(e) => handleViewDocument(e, url)}
                                                            className="flex flex-col gap-2 p-3 border border-slate-200 dark:border-neutral-700 rounded-xl hover:border-violet-400 dark:hover:border-violet-500 transition-colors group bg-slate-50 dark:bg-neutral-800/50 cursor-pointer"
                                                        >
                                                            <div className="aspect-[4/3] bg-slate-200 dark:bg-neutral-700 rounded-lg overflow-hidden flex items-center justify-center relative">
                                                                {isPdf ? (
                                                                    <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-neutral-400">
                                                                        <FileText className="h-8 w-8 text-violet-500" />
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">PDF</span>
                                                                    </div>
                                                                ) : (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <img
                                                                        src={url}
                                                                        alt={name}
                                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                                                                        onError={(e) => {
                                                                            const t = e.target as HTMLImageElement;
                                                                            t.style.display = 'none';
                                                                            const parent = t.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="flex flex-col items-center gap-1 text-slate-400"><svg xmlns=\'http://www.w3.org/2000/svg\' class=\'h-8 w-8\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\' /></svg><span class=\'text-[10px]\'>No Preview</span></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200 truncate flex-1" title={name}>
                                                                    {name}
                                                                </span>
                                                                {isPdf && (
                                                                    <span className="shrink-0 text-[9px] font-black uppercase bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded">
                                                                        PDF
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {detailTab === "Services" && (
                                <div className="space-y-4">
                                    {servicesLoading ? (
                                        <div className="flex flex-col gap-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-neutral-800 animate-pulse" />
                                            ))}
                                        </div>
                                    ) : providerServices.length === 0 ? (
                                        <div className="text-center text-sm text-slate-500 py-8">No services assigned to this provider.</div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {providerServices.map((svc: any) => (
                                                <div key={svc._id} className="border border-slate-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50">
                                                    {/* Header row */}
                                                    <div className="flex items-start gap-3 p-4">
                                                        {svc.service_image && (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={getImageUrl(svc.service_image)} alt={svc.name} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <span className="font-semibold text-slate-900 dark:text-white text-sm">{svc.name}</span>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <span className={cn(
                                                                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                                        svc.active
                                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                                            : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                                                    )}>
                                                                        {svc.active ? "Active" : "Inactive"}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                                        ₹{svc.price} / {svc.duration_minutes}m
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {svc.description && (
                                                                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">{svc.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Detail row */}
                                                    <div className="flex flex-wrap gap-x-6 gap-y-1 px-4 pb-3 text-xs text-slate-600 dark:text-neutral-400 border-t border-slate-100 dark:border-neutral-700 pt-2">
                                                        <span><span className="font-medium text-slate-500">Category:</span> {svc.category_id?.name || '—'}</span>
                                                        {svc.sub_category_id?.name && (
                                                            <span><span className="font-medium text-slate-500">Sub-Category:</span> {svc.sub_category_id.name}</span>
                                                        )}
                                                        {(svc.buffer_before > 0 || svc.buffer_after > 0) && (
                                                            <span><span className="font-medium text-slate-500">Buffer:</span> {svc.buffer_before}m before / {svc.buffer_after}m after</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {detailTab === "Status" && (
                                <div className="space-y-5">
                                    {/* High-Level Performance Metrics */}
                                    <div className="grid grid-cols-2 gap-3 pb-2">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cancellation Rate</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={cn(
                                                    "text-lg font-black",
                                                    (perfMetrics?.cancellationRate ?? 0) > 0.25 ? "text-rose-600" : "text-slate-900 dark:text-white"
                                                )}>
                                                    {perfMetrics ? `${(perfMetrics.cancellationRate * 100).toFixed(1)}%` : "—"}
                                                </span>
                                                {(perfMetrics?.cancellationRate ?? 0) > 0.25 && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                                            </div>
                                            <span className="text-[9px] text-slate-500 italic">Threshold: &lt;25%</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Complaint Ratio</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={cn(
                                                    "text-lg font-black",
                                                    (perfMetrics?.complaintRatio ?? 0) > 0.15 ? "text-rose-600" : "text-slate-900 dark:text-white"
                                                )}>
                                                    {perfMetrics ? `${(perfMetrics.complaintRatio * 100).toFixed(1)}%` : "—"}
                                                </span>
                                                {(perfMetrics?.complaintRatio ?? 0) > 0.20 && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                                            </div>
                                            <span className="text-[9px] text-slate-500 italic">Threshold: &lt;20%</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Completion Rate</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={cn(
                                                    "text-lg font-black",
                                                    (perfMetrics?.completionRate ?? 0) < 0.85 ? "text-amber-600" : "text-emerald-600"
                                                )}>
                                                    {perfMetrics ? `${(perfMetrics.completionRate * 100).toFixed(1)}%` : "—"}
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-slate-500 italic">Target: &gt;85%</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Avg Rating</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-slate-900 dark:text-white">
                                                    {perfMetrics ? perfMetrics.averageRating.toFixed(2) : "—"}
                                                </span>
                                                <span className="text-[10px] font-bold text-amber-500">★</span>
                                            </div>
                                            <span className="text-[9px] text-slate-500 italic">30-Day Avg</span>
                                        </div>
                                    </div>
                                    {/* Trust Status */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-500 font-medium w-[130px]">Trust Status</span>
                                        <Badge variant={
                                            selectedProvider.trust_status === 'VERIFIED' || selectedProvider.trust_status === 'TRUSTED' ? 'success' :
                                                selectedProvider.trust_status === 'PENDING_VERIFICATION' ? 'warning' :
                                                    selectedProvider.trust_status === 'SUSPENDED' || selectedProvider.trust_status === 'REJECTED' ? 'danger' : 'default'
                                        }>
                                            {selectedProvider.trust_status || '—'}
                                        </Badge>
                                    </div>

                                    {/* Onboarding Step */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-500 font-medium w-[130px]">Onboarding</span>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full">
                                            {(selectedProvider.onboardingStep || 'DRAFT').replaceAll('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Account Flags */}
                                    <div className="flex items-start gap-3">
                                        <span className="text-sm text-slate-500 font-medium w-[130px] pt-0.5">Account Flags</span>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={cn(
                                                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                                selectedProvider.active
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                    : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                            )}>
                                                {selectedProvider.active ? '✓ Active' : '✗ Inactive'}
                                            </span>
                                            <span className={cn(
                                                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                                selectedProvider.searchable
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                                    : "bg-slate-100 text-slate-500 dark:bg-neutral-700 dark:text-neutral-400"
                                            )}>
                                                {selectedProvider.searchable ? '✓ Searchable' : '✗ Not Searchable'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delisting Warning */}
                                    {selectedProvider.delisting_warning_start && (
                                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-2">
                                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Performance Warning Active</span>
                                            </div>
                                            <p className="text-sm text-rose-700 dark:text-rose-300">
                                                This provider is in a 7-day grace period due to low performance or high complaints. Failure to improve will lead to automatic suspension.
                                            </p>
                                            <div className="flex justify-between text-[11px] font-medium text-rose-600/70 dark:text-rose-400/70 pt-1">
                                                <span>Started: {new Date(selectedProvider.delisting_warning_start).toLocaleDateString()}</span>
                                                <span>Grace Period Ends: {new Date(new Date(selectedProvider.delisting_warning_start).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                            </div>

                                            {trendData?.summary?.topDecayReasons && trendData.summary.topDecayReasons.length > 0 && (
                                                <div className="pt-2 border-t border-rose-200/50 dark:border-rose-800/50 mt-2">
                                                    <span className="text-[10px] font-black text-rose-600/60 uppercase tracking-widest block mb-1">Top Decay Reasons (Delisting Drivers):</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {trendData.summary.topDecayReasons.map((r: any, i: number) => (
                                                            <span key={i} className="text-[10px] bg-white/50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200/50 text-rose-700 dark:text-rose-300 font-bold">
                                                                {r.reason.replace(/_/g, " ")}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {trendData?.summary?.recommendations && trendData.summary.recommendations.length > 0 && (
                                                <div className="pt-2">
                                                    <span className="text-[10px] font-black text-rose-600/60 uppercase tracking-widest block mb-1">Recommended Optimization:</span>
                                                    <div className="space-y-1">
                                                        {trendData.summary.recommendations.slice(0, 2).map((rec: any, i: number) => (
                                                            <div key={i} className="text-[11px] text-rose-800 dark:text-rose-200 flex items-start gap-1.5">
                                                                <span className="mt-1 w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                                                                {rec.action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-[9px] text-rose-500 italic pt-2 opacity-70">
                                                * Trust scores below 10 or excessive complaint ratios trigger automated delisting.
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection Reasons */}
                                    {selectedProvider.rejection_reasons && selectedProvider.rejection_reasons.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="block text-sm text-slate-500 font-medium">Rejection History:</span>
                                            <ul className="list-disc pl-4 space-y-1 text-sm text-slate-700 dark:text-neutral-300">
                                                {selectedProvider.rejection_reasons.map((r: string, i: number) => (
                                                    <li key={i}>{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Hygiene Checklist */}
                                    {selectedProvider.hygiene_checklist && selectedProvider.hygiene_checklist.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="block text-sm text-slate-500 font-medium">Hygiene Checklist:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedProvider.hygiene_checklist.map((item: string, i: number) => (
                                                    <span key={i} className="text-xs bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 px-2 py-0.5 rounded-full">
                                                        ✓ {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Actions */}
                                    <div className="pt-4 border-t border-slate-200 dark:border-neutral-700 flex flex-col gap-3 mt-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Administrative Actions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedProvider.trust_status === 'PENDING_VERIFICATION' || selectedProvider.trust_status === 'UNLISTED' || selectedProvider.trust_status === 'SUSPENDED') && selectedProvider.status !== 'deleted' && (
                                                <Button size="sm" onClick={() => handleApprove(selectedProvider._id)} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                                    Approve
                                                </Button>
                                            )}
                                            {(selectedProvider.trust_status === 'PENDING_VERIFICATION' || selectedProvider.trust_status === 'UNLISTED') && selectedProvider.status !== 'deleted' && (
                                                <Button size="sm" variant="outline" onClick={() => handleReject(selectedProvider._id)} disabled={actionLoading} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                                    Reject
                                                </Button>
                                            )}
                                            {(selectedProvider.trust_status === 'VERIFIED' || selectedProvider.trust_status === 'TRUSTED') && selectedProvider.status !== 'deleted' && (
                                                <Button size="sm" variant="outline" onClick={() => handleSuspend(selectedProvider._id)} disabled={actionLoading} className="text-red-600 border-red-200 hover:bg-red-50">
                                                    Suspend
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {detailTab === "Activity" && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <span className="text-slate-500 font-medium">Joined Date</span>
                                        <span className="text-slate-900">{new Date(selectedProvider.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {selectedProvider.deletedAt && (
                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                            <span className="text-slate-500 font-medium">Deleted On</span>
                                            <span className="text-slate-900">{new Date(selectedProvider.deletedAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {detailTab === "Trust & Risk" && (
                                <div className="space-y-6">
                                    {/* Trust Trend Panel (Handles its own fetching and defensive rendering) */}
                                    <ProviderTrustTrendPanel key={selectedProvider._id} providerId={selectedProvider._id} />

                                    {/* Primary Trust Status */}
                                </div>
                            )}
                            {detailTab === "Intent Insights" && (
                                <IntentInsightsTab providerId={selectedProvider._id} />
                            )}
                        </div>{/* end scrollable content */}
                    </div>{/* end drawer panel */}
                </>
            )}
        </PageContainer>
    )
}

function IntentInsightsTab({ providerId }: { providerId: string }) {
    const { data: intentRes, isLoading: loadingIntents } = useQuery({
        queryKey: ["provider-intents", providerId],
        queryFn: () => get<any>(`/analytics/provider/${providerId}/intents`),
        enabled: !!providerId,
        retry: false
    })

    const { data: trendsRes } = useQuery({
        queryKey: ["provider-trends", providerId],
        queryFn: () => get<any>(`/analytics/provider/${providerId}/intent-trends`),
        enabled: !!providerId,
        retry: false
    })

    if (loadingIntents) {
        return <div className="py-12 text-center text-sm text-slate-400 animate-pulse font-medium">Analyzing behavioral signals...</div>
    }

    if (!intentRes?.success || !intentRes.data) {
        return (
            <div className="py-12 px-6 border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl bg-slate-50 dark:bg-neutral-950/50 text-center">
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">No intent data for this provider yet.</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Intent insights require active user sessions with behavioral logs.</p>
            </div>
        )
    }

    const intentData = intentRes.data
    const breakdown = intentData.intentBreakdown || {}
    const trends = trendsRes?.data?.trendData || []
    const recommendations = trendsRes?.data?.summary?.recommendations || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Concern Breakdown */}
            <section>
                <h4 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-4">Behavioral Concern Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ConcernBar label="Price Friction" value={breakdown.PRICE_CONCERN || 0} />
                    <ConcernBar label="Review Skepticism" value={breakdown.REVIEW_CONCERN || 0} />
                    <ConcernBar label="Availability Conflict" value={breakdown.AVAILABILITY_CONCERN || 0} />
                    <ConcernBar label="Rating Hesitation" value={breakdown.RATING_CONCERN || 0} />
                    <ConcernBar label="Booking Abandoned" value={breakdown.BOOKING_ABANDONED || 0} />
                    <ConcernBar label="Profile Abandoned" value={breakdown.PROFILE_ABANDONED || 0} />
                    <ConcernBar label="Filter Mismatch" value={breakdown.FILTER_MISMATCH || 0} />
                    <ConcernBar label="Search Bounce" value={breakdown.SEARCH_BOUNCE || 0} />
                </div>
            </section>

            {/* Trends Section */}
            {trends.length > 0 && (
                <section className="pt-6 border-t border-slate-100 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-4">Trust Score Trend (30 Days)</h4>
                    <div className="h-[200px] w-full px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends}>
                                <XAxis
                                    dataKey="date"
                                    hide
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    hide
                                />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '11px' }}
                                    labelClassName="hidden"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="trustScore"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={false}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}

            {/* Optimization Recommendations */}
            {recommendations.length > 0 && (
                <section className="pt-6 border-t border-slate-100 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-4">Optimization Actions</h4>
                    <div className="space-y-3">
                        {recommendations.map((rec: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 group transition-all hover:border-violet-200 dark:hover:border-violet-900 shadow-sm">
                                <div className={cn(
                                    "mt-1 w-2 h-2 rounded-full shrink-0",
                                    rec.priority === 'high' ? "bg-rose-500" : rec.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                                )} />
                                <div className="space-y-1">
                                    <div className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{rec.action}</div>
                                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-normal">{rec.reason}</div>
                                </div>
                                <Badge variant="outline" className="ml-auto text-[9px] uppercase tracking-tighter shrink-0 border-slate-200 dark:border-neutral-700">
                                    {rec.priority} Priority
                                </Badge>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

function ConcernBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="flex justify-between items-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3 rounded-xl hover:border-violet-200 dark:hover:border-violet-900 transition-all group shadow-sm">
            <span className="text-[12px] font-semibold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            <span className="text-[12px] font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-neutral-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-neutral-700">{value}</span>
        </div>
    )
}

import { SectionState } from "@/components/admin/ui/section-state"

// trend
const ProviderTrustTrendPanel = React.memo(({ providerId }: { providerId: string }) => {
    const { data: trend, isLoading, error } = useTrustTrendGraphic(providerId, 30)

    const chartData = trend?.trendData ?? [];

    return (
        <SectionState
            isLoading={isLoading}
            error={error}
            isEmpty={!trend}
            emptyMessage="No trust trend data available for this provider."
        >
            {trend && (
                <div className="border-t border-slate-200 dark:border-neutral-800 pt-5 mt-2 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Trust Analytics Summary</h4>

                    {/* Primary Score Center Block */}
                    <div className="flex flex-col items-center py-6 px-4 bg-slate-50 dark:bg-neutral-900/50 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-inner">
                        <div className="text-4xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                            <span>
                                {typeof trend?.currentTrustScore === "number"
                                    ? trend.currentTrustScore.toFixed(2)
                                    : "—"}
                            </span>
                            <span className="text-sm font-bold text-slate-400">/ 100</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Overall Trust Score</span>

                        <div className="mt-6 flex flex-col items-center">
                            <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {trend?.currentTrustLevel ?? "—"}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Current Trust Level</span>
                        </div>
                    </div>

                    {/* Status row */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-neutral-800/50">
                        <div className="text-center space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Trust Status</span>
                            <span className={`text-xs font-black uppercase tracking-tight ${trend.trend === 'IMPROVING' ? 'text-emerald-600' :
                                trend.trend === 'DECLINING' ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                {trend?.trend ?? "—"}
                            </span>
                        </div>
                        <div className="text-center space-y-1 border-l border-slate-100 dark:border-neutral-800/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Change</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                {typeof trend?.percentChange === "number" // guard
                                    ? `${trend.percentChange >= 0 ? '+' : ''}${trend.percentChange.toFixed(1)}%`
                                    : "—"}
                            </span>
                        </div>
                        <div className="col-span-2 text-center">
                            <span className="text-[9px] text-slate-400 font-medium">Change Since Last Evaluation</span>
                        </div>
                    </div>

                    {/* Chart Implementation */}


                    {/* Trust Scale Legend */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Trust Level Scale</span>
                        <div className="grid grid-cols-5 gap-1 text-[10px] font-bold uppercase tracking-tighter">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-400">&lt; 31</span> {/* legend-align */}
                                <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500">Starter</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-400">31–50</span> {/* legend-align */}
                                <span className="px-1 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-600">Bronze</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-400">51–70</span> {/* legend-align */}
                                <span className="px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600">Silver</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-400">71–85</span> {/* legend-align */}
                                <span className="px-1 py-0.5 rounded bg-violet-50 dark:bg-violet-950/30 text-violet-600">Gold</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-400">≥ 86</span> {/* legend-align */}
                                <span className="px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600">Signature</span>
                            </div>
                        </div>
                    </div>

                    {/* reasons */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* decay */}
                        <div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-2">Top Decay Reasons</span>
                            {(!trend.summary?.topDecayReasons || trend.summary.topDecayReasons.length === 0) ? (
                                <p className="text-xs text-slate-400 italic">None</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {trend.summary.topDecayReasons.slice(0, 3).map((r: any, i: number) => ( // reason-fix
                                        <div key={i} className="text-[11px] bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg px-2.5 py-1.5 text-rose-700 dark:text-rose-400 font-semibold leading-tight">
                                            {r.reason.replace(/_/g, " ")} ×{r.frequency}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* recovery */}
                        <div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Top Recovery Reasons</span>
                            {(!trend.summary?.topRecoveryReasons || trend.summary.topRecoveryReasons.length === 0) ? (
                                <p className="text-xs text-slate-400 italic">None</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {trend.summary.topRecoveryReasons.slice(0, 3).map((r: any, i: number) => ( // reason-fix
                                        <div key={i} className="text-[11px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg px-2.5 py-1.5 text-emerald-700 dark:text-emerald-400 font-semibold leading-tight">
                                            {r.reason.replace(/_/g, " ")} ×{r.frequency}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* recommendations */}
                    <div className="pt-4 border-t border-slate-100 dark:border-neutral-800">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Optimization Recommendations</span>
                        {(!trend.summary?.recommendations || trend.summary.recommendations.length === 0) ? (
                            <p className="text-xs text-slate-400 italic">None</p>
                        ) : (
                            <div className="space-y-3">
                                {trend.summary.recommendations.slice(0, 3).map((rec: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-neutral-900/30 border border-slate-100 dark:border-neutral-800">
                                        <div className={cn(
                                            "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                                            rec.priority === 'high' ? "bg-rose-500 animate-pulse" : rec.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                                        )} />
                                        <div className="space-y-0.5">
                                            <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{rec.action}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-neutral-400 leading-relaxed italic">{rec.reason}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </SectionState>
    )
})

ProviderTrustTrendPanel.displayName = "ProviderTrustTrendPanel"
