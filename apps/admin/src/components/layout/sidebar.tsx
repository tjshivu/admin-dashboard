"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
    Tags
} from "lucide-react"

const sidebarItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/admins", label: "Admins", icon: Users },
    { href: "/providers", label: "Providers", icon: Building2 },
    { href: "/complaints", label: "Complaints", icon: AlertCircle },
    { href: "/reviews", label: "Reviews", icon: Star },
    { href: "/health", label: "System Health", icon: Stethoscope },
    { href: "/categories", label: "Categories", icon: Tags },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCollapsed(true)
        }
    }, [])

    return (
        <div className={`
            relative
            ${collapsed ? "w-24" : "w-72"}
            transition-all duration-300 ease-in-out
            bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm
            hidden md:flex flex-col min-h-screen z-10
        `}>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 hover:text-violet-600 rounded-full p-1 shadow-sm transition-colors z-20 md:flex hidden hover:bg-violet-50 dark:hover:bg-slate-700"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="h-full px-3 py-4 flex flex-col">

                {/* Title */}
                <div className="px-3 mb-6 mt-1 flex items-center h-8">
                    {!collapsed && (
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap overflow-hidden">
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
                                const isExactActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center rounded-lg text-sm transition-all duration-150 font-medium",
                                            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2",
                                            isExactActive
                                                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold"
                                                : "text-slate-600 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-300"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon className={cn("h-5 w-5 shrink-0", isExactActive ? "text-violet-700" : "text-slate-400 group-hover:text-violet-600")} />
                                        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Lower Menu */}
                    <div className="mt-auto flex flex-col gap-2">
                        <nav className="flex flex-col gap-1 pt-4 border-t border-slate-200">
                            <Link href="#" title={collapsed ? "Help and docs" : undefined} className={cn(
                                "group flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                                collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2",
                                "text-slate-600 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-300"
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
