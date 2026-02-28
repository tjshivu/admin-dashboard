/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { post, put, logAdminAction } from "@/lib/api"
import { useToast } from "@/components/providers/toast-provider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"

interface Category {
    _id: string
    name: string
    description: string
}

interface CategoryFormDialogProps {
    category?: Category // If provided, it's edit mode
    trigger?: React.ReactNode
}

export function CategoryFormDialog({ category, trigger }: CategoryFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(category?.name || "")
    const [description, setDescription] = useState(category?.description || "")
    const { showToast } = useToast()
    const queryClient = useQueryClient()

    const isEdit = !!category

    const mutation = useMutation({
        mutationFn: async () => {
            const payload = { name, description }
            if (isEdit) {
                return put(`/categories/${category._id}`, payload)
            } else {
                return post("/categories", payload)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            showToast({
                type: "success",
                message: `Category ${isEdit ? "updated" : "created"} successfully`,
            })
            logAdminAction(
                isEdit ? "Category Updated" : "Category Created",
                isEdit ? `Category "${name}" was updated.` : `New category "${name}" was created.`
            )
            setOpen(false)
            if (!isEdit) {
                setName("")
                setDescription("")
            }
        },
        onError: (error: any) => {
            showToast({
                type: "error",
                message: error.message || "Something went wrong",
            })
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate()
    }

    // Default trigger is an 'Add Category' button
    const defaultTrigger = (
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm font-medium gap-2">
            <Plus className="h-4 w-4" />
            Add Category
        </Button>
    )

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {trigger || defaultTrigger}
            </div>
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? "Edit Category" : "Add New Category"}</DialogTitle>
                                <DialogDescription>
                                    {isEdit ? "Update the details of this category." : "Fill in the details to create a new category."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Electrical"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the category..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white" disabled={mutation.isPending || !name.trim()}>
                                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isEdit ? "Save Changes" : "Create Category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
