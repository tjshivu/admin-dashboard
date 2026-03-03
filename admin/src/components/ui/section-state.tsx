import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionStateProps {
    isLoading?: boolean
    error?: unknown
    isEmpty?: boolean
    emptyMessage?: string
    onRetry?: () => void
    children: React.ReactNode
}

export function SectionState({
    isLoading,
    error,
    isEmpty,
    emptyMessage = 'No data available for this section.',
    onRetry,
    children
}: SectionStateProps) {
    if (isLoading) {
        return (
            <div className="w-full min-h-[120px] bg-slate-50 dark:bg-neutral-800/30 rounded-xl border border-slate-100 dark:border-neutral-800 animate-pulse flex items-center justify-center p-6">
                <span className="text-xs font-bold text-slate-400">LOADING...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-h-[120px] bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30 flex flex-col items-center justify-center p-6 text-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">Data Unavailable</h4>
                    <p className="text-xs text-rose-600 dark:text-rose-400/80 max-w-[250px]">Failed to load data.</p>
                </div>
                {onRetry && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRetry}
                        className="mt-1 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40"
                    >
                        Retry
                    </Button>
                )}
            </div>
        )
    }

    if (isEmpty) {
        return (
            <div className="w-full min-h-[120px] bg-slate-50/50 dark:bg-neutral-900/50 rounded-xl border border-slate-100 dark:border-neutral-800 border-dashed flex items-center justify-center p-6">
                <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{emptyMessage}</p>
            </div>
        )
    }

    return <>{children}</>
}
