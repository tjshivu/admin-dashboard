/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { post, put, logAdminAction } from "@/lib/admin/api"
import { useToast } from "@/components/admin/providers/toast-provider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Plus, Loader2, UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/lib/admin/utils"

interface SubCategory {
    _id: string
    category_id: string | any
    name: string
    description: string
    icon_url: string | null
}

interface SubCategoryFormDialogProps {
    subCategory?: SubCategory // If provided, edit mode
    categoryId: string // ID of the parent category
    trigger?: React.ReactNode
}

export function SubCategoryFormDialog({ subCategory, categoryId, trigger }: SubCategoryFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(subCategory?.name || "")
    const [description, setDescription] = useState(subCategory?.description || "")
    const [iconUrl, setIconUrl] = useState(subCategory?.icon_url || "")

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(subCategory?.icon_url || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { showToast } = useToast()
    const queryClient = useQueryClient()

    const isEdit = !!subCategory

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast({ type: "error", message: "Image must be under 5MB" })
                return
            }
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        setPreviewUrl(iconUrl)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    // Helper to upload image directly to the no-moderation endpoint
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append("image", file)

        // Using native fetch because api.ts assumes JSON payload usually unless overridden
        // Use /api prefix — proxied server-side by next.config.ts to avoid CORS
        const res = await fetch(`/api/uploads/images/no-moderation`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })

        if (!res.ok) {
            const error = await res.json().catch(() => ({}))
            throw new Error(error.message || "Failed to upload image")
        }

        const data = await res.json()
        return data.data.url // as per the controller `{ success: true, data: { url: ...} }`
    }

    const mutation = useMutation({
        mutationFn: async () => {
            let finalIconUrl = iconUrl

            // Step 1: Upload image if a new file is selected
            if (selectedFile) {
                setIsUploading(true)
                try {
                    finalIconUrl = await uploadImage(selectedFile)
                    setIconUrl(finalIconUrl)
                } finally {
                    setIsUploading(false)
                }
            }

            // Step 2: Create or Update SubCategory
            const payload = {
                category_id: categoryId,
                name,
                description,
                ...(finalIconUrl ? { icon_url: finalIconUrl } : {})
            }

            if (isEdit) {
                return put(`/sub-categories/${subCategory._id}`, payload)
            } else {
                return post("/sub-categories", payload)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subcategories", categoryId] })
            showToast({
                type: "success",
                message: `Sub-category ${isEdit ? "updated" : "created"} successfully`,
            })
            logAdminAction(
                isEdit ? "Sub-category Updated" : "Sub-category Created",
                isEdit ? `Sub-category "${name}" was updated.` : `New sub-category "${name}" was created.`
            )
            setOpen(false)
            if (!isEdit) {
                // Reset form completely for 'create' mode
                setName("")
                setDescription("")
                setIconUrl("")
                setSelectedFile(null)
                setPreviewUrl(null)
            }
        },
        onError: (error: any) => {
            setIsUploading(false)
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

    const defaultTrigger = (
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm font-medium gap-2">
            <Plus className="h-4 w-4" />
            Add Sub-category
        </Button>
    )

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && isEdit && subCategory) {
            setName(subCategory.name)
            setDescription(subCategory.description)
            setSelectedFile(null)
            setPreviewUrl(subCategory.icon_url || null)
        }
        setOpen(newOpen)
    }

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {trigger || defaultTrigger}
            </div>
            {open && (
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{isEdit ? "Edit Sub-category" : "Add New Sub-category"}</DialogTitle>
                                <DialogDescription>
                                    {isEdit ? "Update details and change icon." : "Add a sub-category to the selected category."}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                {/* Icon Upload section */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">Icon (Optional)</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group">
                                            {previewUrl ? (
                                                <>
                                                    <Image src={getImageUrl(previewUrl)} alt="Preview" fill className="object-cover" />
                                                    {selectedFile && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button type="button" onClick={clearFile} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-slate-300">
                                                    <UploadCloud className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs w-full"
                                            >
                                                Choose Image
                                            </Button>
                                            <p className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="subname" className="text-sm font-medium">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="subname"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Wiring"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="subdescription" className="text-sm font-medium">Description</Label>
                                    <Textarea
                                        id="subdescription"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description..."
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending || isUploading}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white" disabled={mutation.isPending || isUploading || !name.trim()}>
                                    {(mutation.isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isUploading ? "Uploading..." : isEdit ? "Save Changes" : "Create Sub-category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
