"use client"

import { useState } from "react"
import { post } from "@/lib/admin/api"
import { Button } from "@/components/admin/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/admin/ui/dialog"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/components/admin/providers/toast-provider"

export function AddAdminDialog({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "analyst"
    })
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await post("/admin/add", formData)
            showToast({ type: "success", message: "Admin added successfully" })
            setOpen(false)
            setFormData({ name: "", email: "", password: "", role: "analyst" })
            onSuccess()
        } catch (e) {
            const error = e as Error
            showToast({ type: "error", message: error.message || "Failed to add admin" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm font-semibold">
                <Plus className="mr-2 h-4 w-4" /> Add Admin
            </Button>
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Admin</DialogTitle>
                            <DialogDescription>
                                Create a new admin account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <select
                                        id="role"
                                        className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="operational">Operational</option>
                                        <option value="support">Support</option>
                                        <option value="analyst">Analyst</option>
                                        <option value="founder">Founder</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter className="pt-4 border-t border-slate-100">
                                <Button type="button" variant="outline" className="border-slate-200 text-slate-700 bg-white shadow-sm hover:bg-slate-50" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm font-semibold" disabled={loading}>
                                    {loading ? "Adding..." : "Add Admin"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
