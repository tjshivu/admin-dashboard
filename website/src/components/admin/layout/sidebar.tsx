"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/admin/utils"
import {
    LayoutDashboard,
    Users,
    AlertCircle,
    Stethoscope,
    Star,
    Building2,
    BarChart3,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Tags,
    Lock
} from "lucide-react"
import { useSharedNotifications } from "@/components/admin/providers/notification-provider"
import { useAdminProfile } from "@/hooks/admin/use-admin-profile"

const sidebarItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/admins", label: "Admins", icon: Users },
    { href: "/admin/providers", label: "Providers", icon: Building2 },
    { href: "/admin/complaints", label: "Complaints", icon: AlertCircle },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/health", label: "System Health", icon: Stethoscope },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

import { ALLOWED_ROUTES_FOR_NON_SUPER } from "@/lib/admin/constants"

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const { role } = useAdminProfile()
    const { notifications } = useSharedNotifications()
    const unreadComplaints = notifications.filter(n => !n.read && n.event === "New Complaint").length
    const unreadProviders = notifications.filter(n => !n.read && n.event === "Provider Submitted").length
    const unreadReviews = notifications.filter(n => !n.read && n.event === "new_review").length
    const unreadHealth = notifications.filter(n => !n.read && n.event === "system_alert").length

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            setCollapsed(true)
        }
    }, [])

    const isSuperAdmin = role === "superadmin"

    return (
        <div className={`
            relative
            ${collapsed ? "w-24" : "w-72"}
            transition-all duration-300 ease-in-out
            bg-white dark:bg-neutral-900 border-r border-slate-200 dark:border-neutral-800 shadow-sm
            hidden md:flex flex-col min-h-screen z-10
        `}>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-400 dark:text-neutral-400 hover:text-violet-600 rounded-full p-1 shadow-sm transition-colors z-20 md:flex hidden hover:bg-violet-50 dark:hover:bg-white/10"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="h-full px-3 py-4 flex flex-col">

                {/* Title */}
                <div className="px-3 mb-6 mt-1 flex items-center h-8">
                    {!collapsed && (
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight whitespace-nowrap overflow-hidden">
                            Brikup Admin Dashboard
                        </h1>
                    )}
                </div>

                {/* Main Menu */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
                    <div>
                        {!collapsed ? (
                            <h4 className="mb-4 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Main Menu</h4>
                        ) : (
                            <div className="mb-4 h-4"></div>
                        )}
                        <nav className="flex flex-col gap-1">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon
                                const isExactActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)

                                // RBAC check
                                const isAllowed = isSuperAdmin || ALLOWED_ROUTES_FOR_NON_SUPER.some(route => {
                                    if (route === "/admin") return item.href === "/admin"
                                    return item.href.startsWith(route)
                                })

                                if (!isAllowed) return null

                                const badgeCount =
                                    item.label === "Complaints" ? unreadComplaints :
                                        item.label === "Providers" ? unreadProviders :
                                            item.label === "Reviews" ? unreadReviews :
                                                item.label === "System Health" ? unreadHealth :
                                                    0

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative group flex items-center rounded-lg text-sm transition-all duration-150 font-medium",
                                            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2",
                                            isExactActive
                                                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold"
                                                : "text-slate-600 dark:text-neutral-200 hover:bg-violet-50 dark:hover:bg-white/10 hover:text-violet-600 dark:hover:text-white"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon className={cn("h-5 w-5 shrink-0", isExactActive ? "text-violet-700" : "text-gray-700 dark:text-white group-hover:text-violet-600")} />
                                        {!collapsed && <span className="whitespace-nowrap flex-1">{item.label}</span>}

                                        {/* Expanded Badge */}
                                        {badgeCount > 0 && !collapsed && (
                                            <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-sm">
                                                {badgeCount > 99 ? "99+" : badgeCount}
                                            </span>
                                        )}

                                        {/* Collapsed Dot */}
                                        {badgeCount > 0 && collapsed && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-sm ring-2 ring-white dark:ring-neutral-900"></span>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Lower Menu */}
                    <div className="mt-auto flex flex-col gap-2">
                        <nav className="flex flex-col gap-1 pt-4 border-t border-slate-200">
                            <Link href="/admin/help" title={collapsed ? "Help and docs" : undefined} className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                pathname === '/admin/help' ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                "hover:text-violet-600 dark:hover:text-violet-300"
                            )}>
                                <HelpCircle className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-violet-600" />
                                {!collapsed && <span className="whitespace-nowrap">Help and docs</span>}
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
