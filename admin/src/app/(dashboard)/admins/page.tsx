"use client"

import { useEffect, useState } from "react"
import { get } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/ui/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { AddAdminDialog } from "./add-admin-dialog"
import { DeleteAdminDialog } from "./delete-admin-dialog"

interface Admin {
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)

    const loadAdmins = async () => {
        setLoading(true)
        try {
            const res = await get<Admin[]>("/admin/list")
            if (res && res.success) {
                setAdmins(res.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAdmins()
    }, [])

    return (
        <PageContainer>
            <SectionHeader
                title="Admin Management"
                action={<AddAdminDialog onSuccess={loadAdmins} />}
            />

            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50 border-b border-slate-100">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-700 h-11">Name</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Email</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Role</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">Created At</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 h-11 pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : admins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No admins found</TableCell>
                                </TableRow>
                            ) : (
                                admins.map((admin) => (
                                    <TableRow key={admin._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="font-medium text-slate-900 py-3">{admin.name}</TableCell>
                                        <TableCell className="text-slate-600 py-3">{admin.email}</TableCell>
                                        <TableCell className="py-3">
                                            <Badge variant={admin.role === 'superadmin' ? 'danger' : admin.role === 'founder' ? 'warning' : 'primary'} className="shadow-none uppercase tracking-widest text-[10px]">
                                                {admin.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm py-3 font-mono">{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right py-3 pr-4">
                                            <DeleteAdminDialog admin={admin} onSuccess={loadAdmins} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageContainer>
    )
}
