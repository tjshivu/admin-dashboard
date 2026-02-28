/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/api"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Tags, Layers } from "lucide-react"
import { CategoryList } from "./components/category-list"
import { SubCategoryList } from "./components/sub-category-list"
import { CategoryFormDialog } from "./components/category-form-dialog"
import { useAdminProfile } from "@/hooks/use-admin-profile"

export interface Category {
    _id: string
    name: string
    description: string
    createdAt: string
}

export interface SubCategory {
    _id: string
    category_id: string | any
    name: string
    description: string
    icon_url: string | null
    createdAt: string
}

export default function CategoriesPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const { canCreate, isLoading: roleLoading } = useAdminProfile()

    // Fetch Categories
    const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await get<Category[]>("/categories")
            if (!res?.success) throw new Error("Failed to fetch categories")
            return (res as any).categories || res.data || []
        }
    })

    const categories = categoriesResponse || []

    // Find the currently selected category object for passing to the right panel
    const selectedCategory = categories.find((c: Category) => c._id === selectedCategoryId)

    return (
        <PageContainer>
            <SectionHeader
                title="Categories & Sub-categories"
                action={!roleLoading && canCreate ? <CategoryFormDialog /> : undefined}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
                {/* Left Panel: Categories */}
                <Card className="lg:col-span-4 lg:col-start-1 lg:col-end-5 rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-5">
                        <div className="flex items-center gap-2">
                            <Tags className="h-4 w-4 text-violet-600" />
                            <CardTitle className="text-base font-semibold text-slate-800">Categories</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        {categoriesLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
                            </div>
                        ) : (
                            <CategoryList
                                categories={categories}
                                selectedId={selectedCategoryId}
                                onSelect={setSelectedCategoryId}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Right Panel: Sub-Categories */}
                <Card className="lg:col-span-8 lg:col-start-5 lg:col-end-13 rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-5">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-violet-600" />
                            <CardTitle className="text-base font-semibold text-slate-800">
                                {selectedCategory ? `Sub-categories: ${selectedCategory.name}` : "Sub-categories"}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto bg-slate-50/30">
                        {selectedCategoryId ? (
                            <SubCategoryList categoryId={selectedCategoryId as string} categoryName={selectedCategory?.name || ""} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center bg-slate-50/50">
                                <Tags className="h-12 w-12 mb-4 text-slate-200" />
                                <p className="text-sm font-medium text-slate-500">Select a category</p>
                                <p className="text-xs mt-1">Choose a category from the left panel to view and manage its sub-categories.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div >
        </PageContainer >
    )
}
