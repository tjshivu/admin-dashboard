"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    message: string
}

interface ToastContextValue {
    showToast: (options: { type: ToastType, message: string }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback(({ type, message }: { type: ToastType, message: string }) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => {
            const newToasts = [...prev, { id, type, message }]
            if (newToasts.length > 3) return newToasts.slice(-3)
            return newToasts
        })

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-[88px] right-4 z-50 flex flex-col gap-3 w-full max-w-[320px] sm:max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border animate-in slide-in-from-right-full fade-in duration-300",
                            toast.type === 'success' && "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300",
                            toast.type === 'error' && "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300",
                            toast.type === 'warning' && "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300",
                            toast.type === 'info' && "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950 dark:border-sky-900 dark:text-sky-300"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                        {toast.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                        {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />}
                        {toast.type === 'info' && <Info className="h-5 w-5 shrink-0 mt-0.5" />}

                        <div className="flex-1 text-[14px] font-medium leading-snug">
                            {toast.message}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 text-current opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
