import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/admin/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200/80 shadow-none",
        primary:
          "border-transparent bg-violet-600 text-white shadow hover:bg-violet-700",
        success:
          "border-transparent bg-green-500/10 text-green-600 shadow-none hover:bg-green-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 shadow-none hover:bg-amber-500/20",
        danger:
          "border-transparent bg-red-500/10 text-red-600 shadow-none hover:bg-red-500/20",
        outline: "text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
