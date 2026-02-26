/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { get, patch, post, logAdminAction } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Search, Filter, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/providers/toast-provider"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Badge } from "@/components/ui/badge"
import { GridSystem } from "@/components/ui/grid-system"
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

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
    createdAt: string
    deletedAt?: string
    deletedReason?: string
    documents?: ProviderDocument[]
    aadhaarInfo?: AadhaarInfo
    rejection_reasons?: string[]
}

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("All Providers")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [detailTab, setDetailTab] = useState("Basic Info")
    const { showToast } = useToast()

    const [leftWidth, setLeftWidth] = useState(50)
    const [isResizing, setIsResizing] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return
            const newLeftWidth = (e.clientX / window.innerWidth) * 100
            if (newLeftWidth >= 30 && newLeftWidth <= 70) {
                setLeftWidth(newLeftWidth)
            }
        }
        const handleMouseUp = () => {
            setIsResizing(false)
            document.body.style.cursor = 'default'
        }

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'col-resize'
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'default'
        }
    }, [isResizing])

    const loadProviders = async () => {
        setLoading(true)
        try {
            let activeProviders: Provider[] = []

            const res = await get<Provider[]>("/providers/list?all=true")
            if (res && res.success) {
                activeProviders = res.data
            } else {
                const resAdmin = await get<Provider[]>("/admin/providers")
                if (resAdmin && resAdmin.success) activeProviders = resAdmin.data
            }

            let deletedProviders: Provider[] = []
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resDeleted = await get<any[]>("/admin/providers/deleted")
            if (resDeleted && resDeleted.success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                deletedProviders = resDeleted.data.map((p: any) => ({
                    ...p,
                    status: 'deleted'
                }))
            }

            const allProviders = [...activeProviders, ...deletedProviders]
            setProviders(allProviders)
            setSelectedIds(new Set())

            setSelectedProvider(prev => {
                if (!prev) return null;
                const updated = allProviders.find(p => p._id === prev._id);
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
    const [trustData, setTrustData] = useState<any>(null)
    const [trustHistory, setTrustHistory] = useState<any[]>([])
    const [trustLoading, setTrustLoading] = useState(false)
    const [providerServices, setProviderServices] = useState<any[]>([])
    const [servicesLoading, setServicesLoading] = useState(false)
    const [categoriesMap, setCategoriesMap] = useState<Record<string, any>>({})
    const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, any>>({})

    useEffect(() => {
        if (!selectedProvider?._id) {
            setTrustData(null)
            setTrustHistory([])
            return
        }

        const fetchTrust = async () => {
            setTrustLoading(true)
            try {
                const [trustRes, historyRes] = await Promise.all([
                    get<any>(`/analytics/provider/${selectedProvider._id}/trust`),
                    get<any>(`/analytics/provider/${selectedProvider._id}/trust-history`)
                ])
                if (trustRes?.success) setTrustData(trustRes.data)
                if (historyRes?.success) setTrustHistory(historyRes.data)
            } catch (e) {
                console.error("Failed to fetch trust data", e)
            } finally {
                setTrustLoading(false)
            }
        }
        fetchTrust()
    }, [selectedProvider?._id])

    useEffect(() => {
        if (!selectedProvider?._id || detailTab !== "Services") {
            return
        }
        const fetchServicesAndTaxonomy = async () => {
            setServicesLoading(true)
            try {
                const [servicesRes, catsRes, subCatsRes] = await Promise.all([
                    get<any>(`/services/provider/${selectedProvider._id}`),
                    get<any>("/categories"),
                    get<any>("/sub-categories")
                ])

                if (servicesRes?.success) setProviderServices(servicesRes.data || [])

                if (catsRes?.success && Array.isArray(catsRes.data)) {
                    const cMap: Record<string, any> = {}
                    catsRes.data.forEach((c: any) => cMap[c._id] = c)
                    setCategoriesMap(cMap)
                }

                if (subCatsRes?.success && Array.isArray(subCatsRes.data)) {
                    const sMap: Record<string, any> = {}
                    subCatsRes.data.forEach((s: any) => sMap[s._id] = s)
                    setSubCategoriesMap(sMap)
                }
            } catch (e) {
                console.error("Failed to fetch services", e)
            } finally {
                setServicesLoading(false)
            }
        }
        fetchServicesAndTaxonomy()
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
            if (res && res.success) {
                showToast({ type: "success", message: "Provider approved successfully" })
                logAdminAction("Provider Approved", `Provider ID ${id} was approved.`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to approve provider" })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An error occurred" })
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
            if (res && res.success) {
                showToast({ type: "success", message: "Provider rejected successfully" })
                logAdminAction("Provider Rejected", `Provider ID ${id} was rejected. Reason: ${reason.trim()}`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to reject provider" })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An error occurred" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleSuspend = async (id: string) => {
        if (!confirm("Are you sure you want to suspend this provider?")) return
        setActionLoading(true)
        try {
            const res = await post(`/admin/providers/${id}/suspend`, {})
            if (res && res.success) {
                showToast({ type: "success", message: "Provider suspended successfully" })
                logAdminAction("Provider Suspended", `Provider ID ${id} was suspended.`)
                await fetchProviderDetail(id)
                loadProviders()
            } else {
                showToast({ type: "error", message: res?.message || "Failed to suspend provider" })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An error occurred" })
        } finally {
            setActionLoading(false)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return

        const reason = prompt(`Refusal Reason Required\n\nYou are about to delete ${selectedIds.size} provider(s). This will execute a soft-delete and purge them automatically in 10 days.\n\nEnter reason for log tracking:`)
        if (reason === null) return // cancelled
        if (reason.trim() === '') {
            showToast({ type: "warning", message: "A valid reason is required to perform deletion operations." })
            return
        }

        try {
            const response = await patch('/admin/providers/bulk-delete', {
                ids: Array.from(selectedIds),
                reason: reason.trim()
            })
            if (response.success) {
                showToast({ type: "success", message: `Successfully soft-deleted ${selectedIds.size} provider(s)` })
                loadProviders()
            } else {
                showToast({ type: "error", message: `Error: ${response.message || 'Failed to bulk delete providers'}` })
            }
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "An unexpected error occurred during bulk deletion." })
        }
    }

    useEffect(() => {
        loadProviders()
    }, [])

    const tabs = ["All Providers", "Active", "Pending", "Suspended", "Deleted"]

    const filteredProviders = providers.filter(p => {
        if (activeTab === "Active") return p.status === "active"
        if (activeTab === "Pending") return p.status === "pending"
        if (activeTab === "Suspended") return p.status === "suspended"
        if (activeTab === "Deleted") return p.status === "deleted"
        return true
    })

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

    return (
        <PageContainer>
            <SectionHeader
                title={`Providers ${providers.length > 0 ? `(${providers.length})` : ''}`}
                action={
                    <>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 shadow-sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        {selectedIds.size > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="shadow-sm"
                                onClick={handleBulkDelete}
                            >
                                Delete Selected ({selectedIds.size})
                            </Button>
                        )}
                    </>
                }
            />

            <div
                className={cn("grid gap-0 items-start", !selectedProvider ? "grid-cols-1" : "lg:grid-cols-[1fr_6px_1fr]")}
                style={selectedProvider ? { gridTemplateColumns: `${leftWidth}% 6px ${100 - leftWidth}%` } : {}}
            >
                {/* Main Table Card */}
                <Card className="w-full overflow-hidden">
                    {/* Tabs */}
                    <div className="px-6 flex items-center gap-6 border-b border-slate-200">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "py-4 text-sm font-semibold transition-all relative border-b-2",
                                    activeTab === tab ? "text-violet-600 border-violet-600" : "text-slate-500 hover:text-slate-900 border-transparent"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search providers..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                                        <TableHead className="w-12 text-center pl-6">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-violet-600 focus:ring-violet-600 shadow-sm"
                                                checked={filteredProviders.length > 0 && selectedIds.size === filteredProviders.length}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                            />
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-500 h-10">Provider Info</TableHead>
                                        <TableHead className="font-semibold text-slate-500 h-10">Joined Date</TableHead>
                                        <TableHead className="font-semibold text-slate-500 h-10">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-slate-500">Loading specific data...</TableCell>
                                        </TableRow>
                                    ) : filteredProviders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-slate-500">No providers found in this category</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProviders.map((p) => (
                                            <TableRow
                                                key={p._id}
                                                className={cn(
                                                    "border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer",
                                                    selectedProvider?._id === p._id && "bg-slate-50",
                                                    p.status === 'deleted' ? 'opacity-70' : ''
                                                )}
                                                onClick={() => {
                                                    if (selectedProvider?._id !== p._id) {
                                                        setSelectedProvider(p)
                                                        fetchProviderDetail(p._id)
                                                    }
                                                }}
                                            >
                                                <TableCell className="w-12 text-center pl-6" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-600 shadow-sm"
                                                        checked={selectedIds.has(p._id)}
                                                        onChange={(e) => handleSelectRow(p._id, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4">
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
                                                    <Badge variant={
                                                        p.status === 'active' ? 'success' :
                                                            p.status === 'pending' ? 'warning' :
                                                                p.status === 'deleted' ? 'default' : 'danger'
                                                    } className={p.status === 'deleted' ? 'bg-slate-100 text-slate-500 font-normal shadow-none' : ''}>
                                                        {p.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Panel Detail Inspector */}
                {selectedProvider && (
                    <>
                        <div
                            className={cn(
                                "hidden lg:block w-[6px] h-full cursor-col-resize hover:bg-slate-200 transition-colors self-stretch",
                                isResizing && "bg-violet-400 lg:hover:bg-violet-400"
                            )}
                            onMouseDown={(e) => {
                                setIsResizing(true)
                                e.preventDefault()
                            }}
                        />
                        <Card className="w-full shrink-0 sticky top-6 overflow-auto max-h-[calc(100vh-120px)]">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-start gap-4">
                                <div>
                                    <h3 className={cn("text-lg font-bold text-slate-900", selectedProvider.status === 'deleted' && 'line-through text-slate-500')}>{selectedProvider.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedProvider.email}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedProvider(null)} className="h-8 w-8 text-slate-400 shrink-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="px-6 flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
                                {["Basic Info", "Documents", "Services", "Status", "Activity", "Trust & Risk", "Intent Insights"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setDetailTab(tab)}
                                        className={cn(
                                            "py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap",
                                            detailTab === tab ? "text-violet-600 border-violet-600" : "text-slate-500 hover:text-slate-900 border-transparent"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <CardContent className="p-6 pt-6 min-h-[300px]">
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
                                            <div className="text-center text-sm text-slate-500 py-4">Loading documents...</div>
                                        ) : !selectedProvider.documents || selectedProvider.documents.length === 0 ? (
                                            <div className="text-center text-sm text-slate-500 py-4">No documents uploaded.</div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedProvider.documents.map((doc, idx) => (
                                                    <a key={doc._id || idx} href={doc.document_url} target="_blank" rel="noreferrer" className="flex flex-col gap-2 p-3 border border-slate-200 rounded-lg hover:border-violet-300 transition-colors group bg-slate-50">
                                                        <div className="aspect-square bg-slate-200 rounded-md overflow-hidden relative">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={doc.document_url || '/placeholder.png'} alt={doc.document_type || 'document'} className="object-cover w-full h-full group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png' }} />
                                                        </div>
                                                        <div className="text-xs font-medium text-slate-700 uppercase line-clamp-1" title={(doc.document_type || 'document').replaceAll('_', ' ')}>
                                                            {(doc.document_type || 'document').replaceAll('_', ' ')}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {detailTab === "Services" && (
                                    <div className="space-y-4">
                                        {servicesLoading ? (
                                            <div className="text-center text-sm text-slate-500 py-8">Loading services...</div>
                                        ) : providerServices.length === 0 ? (
                                            <div className="text-center text-sm text-slate-500 py-8">No services assigned to this provider.</div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {providerServices.map((svc: any) => (
                                                    <div key={svc._id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-semibold text-slate-900">{svc.name}</span>
                                                            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">₹{svc.price} / {svc.duration_minutes}m</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 mt-2 text-sm text-slate-600">
                                                            <div className="flex gap-2 items-center">
                                                                <span className="font-medium text-slate-500 w-24">Category:</span>
                                                                <span className="bg-slate-200/50 px-2 py-0.5 rounded text-slate-700">{categoriesMap[svc.category_id]?.name || svc.category_id || '—'}</span>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <span className="font-medium text-slate-500 w-24">Sub-Category:</span>
                                                                <span className="bg-slate-200/50 px-2 py-0.5 rounded text-slate-700">{subCategoriesMap[svc.sub_category_id]?.name || svc.sub_category_id || '—'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {detailTab === "Status" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-slate-500 font-medium w-[100px]">Current</span>
                                            <Badge variant={
                                                (selectedProvider.trust_status || selectedProvider.status) === 'VERIFIED' || (selectedProvider.trust_status || selectedProvider.status) === 'active' ? 'success' :
                                                    (selectedProvider.trust_status || selectedProvider.status) === 'PENDING_VERIFICATION' || (selectedProvider.trust_status || selectedProvider.status) === 'pending' ? 'warning' :
                                                        (selectedProvider.trust_status || selectedProvider.status) === 'deleted' ? 'default' : 'danger'
                                            } className={(selectedProvider.trust_status || selectedProvider.status) === 'deleted' ? 'bg-slate-100 text-slate-500 font-normal shadow-none' : ''}>
                                                {selectedProvider.trust_status || selectedProvider.status}
                                            </Badge>
                                        </div>

                                        {selectedProvider.rejection_reasons && selectedProvider.rejection_reasons.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="block text-sm text-slate-500 font-medium">Rejection History:</span>
                                                <ul className="list-disc pl-4 space-y-1 text-sm text-slate-700">
                                                    {selectedProvider.rejection_reasons.map((r, i) => (
                                                        <li key={i}>{r}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {selectedProvider.status === 'deleted' && selectedProvider.deletedReason && (
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="block text-slate-500 font-medium mb-1">Reason for Deletion:</span>
                                                <span className="text-slate-900">{selectedProvider.deletedReason}</span>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-slate-200 flex flex-col gap-3 mt-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Administrative Actions</p>
                                            <div className="flex flex-wrap gap-2">
                                                {/* Approve: Only for PENDING, UNLISTED, or SUSPENDED (Restore) */}
                                                {(selectedProvider.trust_status === 'PENDING_VERIFICATION' || selectedProvider.trust_status === 'UNLISTED' || selectedProvider.trust_status === 'SUSPENDED') && selectedProvider.status !== 'deleted' && (
                                                    <Button size="sm" onClick={() => handleApprove(selectedProvider._id)} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                                        Approve
                                                    </Button>
                                                )}

                                                {/* Reject: Only for PENDING or UNLISTED */}
                                                {(selectedProvider.trust_status === 'PENDING_VERIFICATION' || selectedProvider.trust_status === 'UNLISTED') && selectedProvider.status !== 'deleted' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleReject(selectedProvider._id)} disabled={actionLoading} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                                        Reject
                                                    </Button>
                                                )}

                                                {/* Suspend: Only for VERIFIED or TRUSTED */}
                                                {(selectedProvider.trust_status === 'VERIFIED' || selectedProvider.trust_status === 'TRUSTED') && selectedProvider.status !== 'deleted' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleSuspend(selectedProvider._id)} disabled={actionLoading} className="text-red-600 border-red-200 hover:bg-red-50">
                                                        Suspend
                                                    </Button>
                                                )}
                                                {selectedProvider.status !== 'deleted' && (
                                                    <Button size="sm" variant="outline" onClick={() => {
                                                        setSelectedIds(new Set([selectedProvider._id]));
                                                        handleBulkDelete();
                                                    }} disabled={actionLoading} className="text-red-600 border-red-200 hover:bg-red-50 ml-auto">
                                                        Delete
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
                                        {trustLoading ? (
                                            <div className="text-center text-sm text-slate-500 py-8">Loading trust metrics...</div>
                                        ) : trustData ? (
                                            <>
                                                {/* Trust Score Header Card */}
                                                <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Trust Score</div>
                                                    <div className={cn(
                                                        "text-5xl font-bold mb-2",
                                                        trustData.trustScore >= 75 ? "text-emerald-600" :
                                                            trustData.trustScore >= 50 ? "text-amber-500" :
                                                                "text-red-500"
                                                    )}>
                                                        {trustData.trustScore || 0}
                                                    </div>
                                                    <div className="flex gap-4 text-sm font-medium mt-2">
                                                        <span className="text-slate-700">Level: <span className="font-bold">{trustData.trustLevel?.replace('_', ' ') || 'UNKNOWN'}</span></span>
                                                        <span className="text-slate-300">|</span>
                                                        <span className="text-slate-700">Visibility: {(trustData.visibilityMultiplier || 0).toFixed(2)}x</span>
                                                    </div>
                                                </Card>

                                                {/* Trust Trend Graph */}
                                                <div className="w-full h-[200px] mt-2 mb-4">
                                                    {trustHistory && trustHistory.length > 0 ? (
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={trustHistory}>
                                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                                                <YAxis domain={['dataMin - 10', 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-10} />
                                                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                                <Line type="monotone" dataKey="trustScore" stroke="#3B82F6" strokeWidth={2} dot={trustHistory.length === 1} activeDot={{ r: 4 }} />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-medium text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                                                            No trust history available.
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Trust Breakdown Grid */}
                                                <GridSystem cols={3} className="gap-4">
                                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                                        <span className="text-xs font-semibold text-blue-600 mb-1 uppercase">Behavior</span>
                                                        <span className="text-xl font-bold text-slate-800">{trustData.components?.behaviourScore || 0}</span>
                                                    </div>
                                                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                                        <span className="text-xs font-semibold text-emerald-600 mb-1 uppercase">Review Cred</span>
                                                        <span className="text-xl font-bold text-slate-800">{trustData.components?.reviewCredibility || 0}</span>
                                                    </div>
                                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                                        <span className="text-xs font-semibold text-amber-600 mb-1 uppercase">Hygiene</span>
                                                        <span className="text-xl font-bold text-slate-800">{trustData.components?.hygieneScore || 0}</span>
                                                    </div>
                                                </GridSystem>

                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                                        <span className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Cancel Rate</span>
                                                        <span className="text-lg font-bold text-slate-900">{(trustData.components?.cancellationRate || 0).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                                        <span className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Complaint Ratio</span>
                                                        <span className="text-lg font-bold text-slate-900">{(trustData.components?.complaintRatio || 0).toFixed(1)}%</span>
                                                    </div>
                                                </div>

                                                {/* Action Flags */}
                                                <div className="pt-4 border-t border-slate-200 mt-2">
                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Action Flags</h4>
                                                    {trustData.actionFlags && trustData.actionFlags.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {trustData.actionFlags.map((flag: any, idx: number) => (
                                                                <span key={idx} className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold uppercase">
                                                                    {flag.action || flag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                                            No active risk flags.
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-sm text-slate-500 py-8">Trust data not initialized for this provider.</div>
                                        )}
                                    </div>
                                )}
                                {detailTab === "Intent Insights" && (
                                    <IntentInsightsTab providerId={selectedProvider._id} />
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
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

    const { data: funnelRes, isLoading: loadingFunnel } = useQuery({
        queryKey: ["provider-funnel", providerId],
        queryFn: () => get<any>(`/analytics/provider/${providerId}/session-funnel`),
        enabled: !!providerId,
        retry: false
    })

    const { data: trendsRes } = useQuery({
        queryKey: ["provider-trends", providerId],
        queryFn: () => get<any>(`/analytics/provider/${providerId}/intent-trends`),
        enabled: !!providerId,
        retry: false
    })

    if (loadingIntents || loadingFunnel) {
        return <div className="py-12 text-center text-sm text-slate-400 animate-pulse font-medium">Analyzing intent signals...</div>
    }

    const noData = (!intentRes?.success && !funnelRes?.success)

    if (noData) {
        return (
            <div className="py-12 px-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                <p className="text-sm font-semibold text-slate-800 mb-1">No intent data for this provider yet.</p>
                <p className="text-xs text-slate-500">Intent insights require active user sessions with specific behavior patterns.</p>
            </div>
        )
    }

    const intents = intentRes?.data || {}
    const funnel = funnelRes?.data || {}

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Concern Breakdown */}
            <section>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Concern Breakdown</h4>
                <div className="space-y-4">
                    <ConcernBar label="Price Concern" value={intents.priceConcern || 0} color="bg-indigo-500" />
                    <ConcernBar label="Review Concern" value={intents.reviewConcern || 0} color="bg-violet-500" />
                    <ConcernBar label="Availability Concern" value={intents.availabilityConcern || 0} color="bg-blue-500" />
                    <ConcernBar label="Rating Concern" value={intents.ratingConcern || 0} color="bg-purple-500" />
                    <ConcernBar label="Booking Abandoned" value={intents.bookingAbandoned || 0} color="bg-slate-400" />
                </div>
            </section>

            {/* Session Funnel */}
            <section className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Session Funnel</h4>
                <div className="grid grid-cols-5 gap-2">
                    <FunnelStep label="Search" count={funnel.stages?.search || 0} dropoff={0} />
                    <FunnelStep label="View" count={funnel.stages?.view || 0} dropoff={funnel.dropoffs?.viewToPrice || 0} />
                    <FunnelStep label="Price" count={funnel.stages?.price || 0} dropoff={funnel.dropoffs?.priceToBooking || 0} />
                    <FunnelStep label="Booking" count={funnel.stages?.booking || 0} dropoff={funnel.dropoffs?.bookingToComplete || 0} />
                    <FunnelStep label="Completed" count={funnel.stages?.completed || 0} dropoff={0} isLast />
                </div>
            </section>

            {/* Trends State */}
            {trendsRes?.success ? (
                <section className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Intent Trends</h4>
                    <div className="h-[150px] w-full bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                        <span className="text-xs text-slate-400 font-medium italic">Trend visualization active</span>
                    </div>
                </section>
            ) : (
                <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 text-center text-[11px] text-slate-400 font-medium italic">
                    Insufficient data for trend analysis
                </div>
            )}
        </div>
    )
}

function ConcernBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-semibold text-slate-700">{label}</span>
                <span className="text-[13px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{value}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                    style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                />
            </div>
        </div>
    )
}

function FunnelStep({ label, count, dropoff, isLast, isFirst }: { label: string, count: number, dropoff: number, isLast?: boolean, isFirst?: boolean }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-tighter">{label}</div>
            <div className="w-full bg-white border border-slate-200 py-2 rounded-lg shadow-sm">
                <div className="text-[13px] font-black text-slate-900">{count}</div>
            </div>
            {!isLast && (
                <div className="flex flex-col items-center mt-1">
                    <div className="w-0.5 h-3 bg-slate-200"></div>
                    <div className="text-[9px] font-bold text-red-500 -mt-0.5">-{dropoff}%</div>
                </div>
            )}
        </div>
    )
}
