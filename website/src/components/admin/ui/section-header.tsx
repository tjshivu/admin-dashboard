import * as React from "react"
import { cn } from "@/lib/admin/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    action?: React.ReactNode
}

export function SectionHeader({ title, action, className, ...props }: SectionHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)} {...props}>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>
            {action && (
                <div className="flex items-center gap-3">
                    {action}
                </div>
            )}
        </div>
    )
}
