"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { post } from "@/lib/admin/api"

import { Button } from "@/components/admin/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Loader2 } from "lucide-react"

export function LoginForm() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await post("/admin/login", { email, password })
            if (res.success) {
                await queryClient.invalidateQueries({ queryKey: ["admin-profile"] })
                router.push("/admin") // Redirect to dashboard
            } else {

                setError(res?.message || "Login failed")
            }
        } catch (err) {
            const error = err as Error
            setError(error.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-[380px] rounded-xl shadow-md border-slate-200 bg-white">
            <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">Admin Login</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500 mt-1">
                    Enter your credentials to access the system.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-5 px-6">
                    {error && (
                        <div className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-md text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="font-medium text-slate-700 text-sm">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg h-10 px-3 border-slate-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500 text-slate-900 transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="font-medium text-slate-700 text-sm">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg h-10 px-3 border-slate-300 bg-white focus-visible:ring-blue-500 focus-visible:border-blue-500 text-slate-900 transition-all font-medium"
                        />
                    </div>
                </CardContent>
                <CardFooter className="px-6 pb-8 pt-2">
                    <Button
                        className="w-full h-10 rounded-lg bg-[#0f172a] text-white font-medium text-sm shadow-sm hover:bg-blue-600 transition-colors"
                        type="submit"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Authenticating..." : "Sign In"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
