import * as React from "react"
import { cn } from "@/lib/admin/utils"

export function GridSystem({ className, children, cols = 1, ...props }: React.HTMLAttributes<HTMLDivElement> & { cols?: 1 | 2 | 3 | 4 | 5 }) {
    const colClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    }

    return (
        <div className={cn("grid gap-6", colClasses[cols], className)} {...props}>
            {children}
        </div>
    )
}
