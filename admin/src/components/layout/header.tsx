"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Bell, ChevronDown, CheckCheck } from "lucide-react"
import { post } from "@/lib/api"
import { useAdminProfile } from "@/hooks/use-admin-profile"
import { useSharedNotifications } from "@/components/providers/notification-provider"

export function Header() {
    const router = useRouter()
    const { adminProfile } = useAdminProfile()
    const [isDark, setIsDark] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useSharedNotifications()

    const dropdownRef = useRef<HTMLDivElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsDark(typeof document !== "undefined" && document.documentElement.classList.contains("dark"))
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.pathname.includes("/login")) {
            return;
        }
        const timerId = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timerId)
    }, [])

    const handleLogout = async () => {
        try {
            await post("/admin/logout", {})
            router.push("/login")
        } catch (e) {
            console.error("Logout failed", e)
        }
    }

    return (
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 shrink-0 z-10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)]">
            <div className="flex-1 flex items-center gap-4 max-w-[480px]">
            </div>

            <div className="flex items-center gap-2 lg:gap-3 ml-auto">
                {currentTime && (
                    <div className="hidden md:flex flex-col items-end mr-4 pr-4 border-r border-slate-200 dark:border-neutral-800">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
                            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                )}

                <div className="relative" ref={notifRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-gray-700 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-200"
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen)
                            // Request browser notification permission if not asked
                            if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
                                Notification.requestPermission()
                            }
                        }}
                    >
                        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'animate-ring' : ''}`} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>

                    {isNotifOpen && (
                        <div className="absolute right-0 md:right-auto md:-left-48 mt-3 w-[380px] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform-gpu origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        Change Log
                                        {unreadCount > 0 && (
                                            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {unreadCount} NEW
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time system updates</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg"
                                    >
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        All Read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[420px] overflow-y-auto w-full custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3">
                                            <Bell className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500">All clear</p>
                                        <p className="text-[10px] text-slate-400 mt-1">No recent activity detected</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n._id}
                                            className={`group relative p-5 border-b border-slate-50 dark:border-neutral-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-neutral-800/30 transition-all cursor-pointer flex gap-4 ${!n.read ? 'bg-blue-50/10' : ''}`}
                                            onClick={() => { if (!n.read) markAsRead(n._id) }}
                                        >
                                            <div className="flex-1 flex flex-col gap-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm leading-tight transition-colors ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-neutral-400'}`}>
                                                        {n.event}
                                                    </h4>
                                                    {!n.read && <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                                                </div>
                                                <p className={`text-xs leading-snug ${!n.read ? 'text-slate-600 dark:text-neutral-300' : 'text-slate-400 dark:text-neutral-500'}`}>
                                                    {n.payload?.description || "System broadcast update"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                                                        {new Date(n.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) === new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) ? 'Today' : new Date(n.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-medium">
                                                        {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-slate-50 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/20 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">End of Change Log</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full"
                    onClick={() => {
                        document.documentElement.classList.toggle("dark")
                        setIsDark(document.documentElement.classList.contains("dark"))
                    }}
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-1 hidden sm:block"></div>

                <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center gap-2 cursor-pointer ml-1 sm:ml-2 group" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-neutral-900">
                            <span className="text-sm">{(adminProfile?.name || "A")[0].toUpperCase()}</span>
                        </div>
                        <div className="hidden lg:flex flex-col items-start mr-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-white leading-none mb-0.5">{adminProfile?.name || "Admin"}</span>
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider leading-none">{adminProfile?.role || "Team"}</span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-4 py-3 border-b border-slate-50 dark:border-neutral-800 overflow-hidden">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Admin Identification</p>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-800/50 p-2 rounded-xl border border-slate-100 dark:border-neutral-800">
                                    <code className="text-[9px] font-mono text-slate-500 dark:text-neutral-400 break-all leading-tight">
                                        {adminProfile?.id || "Session active"}
                                    </code>
                                </div>
                            </div>
                            <div className="p-1">
                                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-all" onClick={() => router.push("/profile")}>
                                    Account Settings
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all" onClick={handleLogout}>
                                    Secure Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
