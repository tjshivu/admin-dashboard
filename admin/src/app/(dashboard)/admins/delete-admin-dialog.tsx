"use client"

import { useState } from "react"
import { del } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/providers/toast-provider"

interface Admin {
    _id: string
    name: string
    email: string
}

export function DeleteAdminDialog({ admin, onSuccess }: { admin: Admin, onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [confirmName, setConfirmName] = useState("")
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const handleDelete = async () => {
        if (confirmName !== admin.name || !reason.trim()) return
        setLoading(true)
        try {
            await del(`/admin/remove/${admin._id}?reason=${encodeURIComponent(reason.trim())}`)
            showToast({ type: "success", message: `Admin ${admin.name} deleted successfully` })
            setOpen(false)
            setConfirmName("")
            setReason("")
            onSuccess()
        } catch (e) {
            console.error(e)
            showToast({ type: "error", message: "Failed to delete admin" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
            </Button>
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Admin</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. To confirm, please type the admin name <b>{admin.name}</b> below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Admin Name</Label>
                                <Input
                                    id="name"
                                    value={confirmName}
                                    onChange={(e) => setConfirmName(e.target.value)}
                                    placeholder="Type admin name here"
                                />
                            </div>
                            <div className="grid gap-2 mt-2">
                                <Label htmlFor="reason">Reason for Deletion</Label>
                                <Input
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Why is this admin being removed?"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button variant="outline" className="border-slate-200 text-slate-700 bg-white shadow-sm hover:bg-slate-50" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                className="shadow-sm font-semibold"
                                disabled={confirmName !== admin.name || !reason.trim() || loading}
                                onClick={handleDelete}
                            >
                                {loading ? "Deleting..." : "Delete Admin"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
