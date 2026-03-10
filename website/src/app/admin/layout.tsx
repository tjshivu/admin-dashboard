import type { Metadata } from "next";
import "./admin.css";
import QueryProvider from "@/components/admin/providers/query-provider";
import { ThemeProvider } from "@/components/admin/theme-provider";

export const metadata: Metadata = {
    title: "Brikup Admin Dashboard",
    description: "Admin Dashboard for Brikup Platform",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}
