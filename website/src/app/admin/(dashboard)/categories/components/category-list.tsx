/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { CategoryFormDialog } from "./category-form-dialog"
import { DeleteDialog } from "./delete-dialog"
// Removed date-fns
import { useAdminProfile } from "@/hooks/admin/use-admin-profile"

interface Category {
    _id: string
    name: string
    description: string
    createdAt: string
}

interface CategoryListProps {
    categories: Category[]
    selectedId: string | null
    onSelect: (id: string) => void
}

export function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
    const { canEdit, canDelete, isLoading: roleLoading } = useAdminProfile()

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <p>No categories found.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col divide-y divide-slate-100">
            {categories.map((category) => (
                <div
                    key={category._id}
                    onClick={() => onSelect(category._id)}
                    className={`
                        flex items-center justify-between p-4 cursor-pointer transition-colors
                        ${selectedId === category._id ? "bg-violet-50/50 border-l-2 border-l-violet-500" : "hover:bg-slate-50 border-l-2 border-l-transparent"}
                    `}
                >
                    <div className="flex flex-col overflow-hidden pr-4 w-full">
                        <h4 className="font-medium text-slate-800 truncate text-sm">
                            {category.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                            {category.description || "No description"}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
                            {new Date(category.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>

                    {/* Actions Menu */}
                    {(!roleLoading && (canEdit || canDelete)) && (
                        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            {canEdit && (
                                <CategoryFormDialog category={category} trigger={
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-violet-600 hover:bg-violet-50">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                } />
                            )}
                            {canDelete && (
                                <DeleteDialog
                                    title="Delete Category"
                                    description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                                    endpoint={`/categories/${category._id}`}
                                    queryKey="categories"
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
            ))}
        </div>
    )
}
