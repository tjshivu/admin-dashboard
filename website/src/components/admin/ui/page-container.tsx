import * as React from "react"
import { cn } from "@/lib/admin/utils"

export function PageContainer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mx-auto max-w-7xl w-full space-y-6 md:space-y-8 p-3 md:p-6 overflow-x-hidden", className)} {...props}>
            {children}
        </div>
    )
}
