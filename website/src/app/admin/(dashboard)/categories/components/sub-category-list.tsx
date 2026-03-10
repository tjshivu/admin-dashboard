/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/admin/api"
import { Badge } from "@/components/admin/ui/badge"
import { Pencil, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { SubCategoryFormDialog } from "./sub-category-form-dialog"
import { DeleteDialog } from "./delete-dialog"
import Image from "next/image"
import { useAdminProfile } from "@/hooks/admin/use-admin-profile"

interface SubCategory {
    _id: string
    category_id: string | any
    name: string
    description: string
    icon_url: string | null
    createdAt: string
}

interface SubCategoryListProps {
    categoryId: string
    categoryName: string
}

export function SubCategoryList({ categoryId, categoryName }: SubCategoryListProps) {
    const { canCreate, canEdit, canDelete, isLoading: roleLoading } = useAdminProfile()

    const { data: subCategoriesResponse, isLoading } = useQuery({
        queryKey: ["subcategories", categoryId],
        queryFn: async () => {
            const res = await get<SubCategory[]>(`/sub-categories?category_id=${categoryId}`)
            if (!res?.success) throw new Error("Failed to fetch sub-categories")
            return (res as any).subCategories || res.data || []
        },
        enabled: !!categoryId,
    })

    const subCategories: SubCategory[] = subCategoriesResponse || []

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header Actions for Right Panel */}
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h3 className="text-sm font-medium text-slate-800">Manage Sub-categories</h3>
                    <p className="text-xs text-slate-500">{subCategories.length} items found</p>
                </div>
                {(!roleLoading && canCreate) && <SubCategoryFormDialog categoryId={categoryId} />}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {subCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-white rounded-lg border border-dashed border-slate-200">
                        <p className="text-sm">No sub-categories in this category yet.</p>
                    </div>
                ) : (
                    subCategories.map((sub) => (
                        <div key={sub._id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-4 hover:border-violet-200 transition-colors shadow-sm">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {sub.icon_url ? (
                                    <Image src={sub.icon_url} alt={sub.name} width={48} height={48} className="object-cover h-full w-full" />
                                ) : (
                                    <div className="text-slate-400 text-xs font-medium">No Icon</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-slate-800 truncate text-sm">{sub.name}</h4>

                                    {/* Action Drodpown */}
                                    {(!roleLoading && (canEdit || canDelete)) && (
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {canEdit && (
                                                <SubCategoryFormDialog subCategory={sub} categoryId={categoryId} trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-violet-600 hover:bg-violet-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                } />
                                            )}
                                            {canDelete && (
                                                <DeleteDialog
                                                    title="Delete Sub-category"
                                                    description={`Are you sure you want to delete "${sub.name}"? This action cannot be undone.`}
                                                    endpoint={`/sub-categories/${sub._id}`}
                                                    queryKey="subcategories"
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {sub.description || "No description provided."}
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 font-normal">
                                        Parent: {categoryName}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
