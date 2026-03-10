/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { del } from "@/lib/admin/api"
import { useToast } from "@/components/admin/providers/toast-provider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Loader2 } from "lucide-react"

interface DeleteDialogProps {
    title: string
    description: string
    endpoint: string // e.g. "/categories/123"
    queryKey: string // e.g. "categories" or "subcategories"
    trigger: React.ReactNode
}

export function DeleteDialog({ title, description, endpoint, queryKey, trigger }: DeleteDialogProps) {
    const [open, setOpen] = useState(false)
    const { showToast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            return del(endpoint)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] })
            // If deleting a sub-category, invalidate subcategories
            if (queryKey === "subcategories") {
                // invalidate all subcategory queries (since we don't know the parent category here easily, or we can just invalidate the base key)
                queryClient.invalidateQueries({ queryKey: ["subcategories"] })
            }
            showToast({
                type: "success",
                message: "Item has been successfully deleted.",
            })
            setOpen(false)
        },
        onError: (error: any) => {
            showToast({
                type: "error",
                message: error.message || "Failed to delete item",
            })
        }
    })

    const handleDelete = () => {
        mutation.mutate()
    }

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {trigger}
            </div>
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-red-600">{title}</DialogTitle>
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
