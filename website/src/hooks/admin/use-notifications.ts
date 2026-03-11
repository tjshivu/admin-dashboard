import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { get, patch } from "@/lib/admin/api";
import { queryClient } from "@/lib/admin/query-client";
import { useAdminProfile } from "./use-admin-profile";

export interface AdminNotification {
    _id: string;
    event: string;
    payload?: {
        description?: string;
        [key: string]: any;
    };
    read?: boolean;
    createdAt: string;
}

export function useNotifications() {
    const { adminProfile } = useAdminProfile();
    const [localNotifications, setLocalNotifications] = useState<AdminNotification[]>([]);

    const { data: serverNotifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            // Note: Current backend getNotifications doesn't handle req.admin properly.
            // This will likely return empty or 400, so we wrap in a try-catch and return []
            try {
                const res = await get<AdminNotification[]>("/notifications/me/admin?recipientType=admin");
                return res?.success ? res.data : [];
            } catch (err) {
                console.warn("[Notifications] Backend fetch failed (likely endpoint limitation)");
                return [];
            }
        },
        enabled: !!adminProfile?.id,
        staleTime: 30000,
    });

    // Merge server data with local real-time updates
    useEffect(() => {
        if (serverNotifications) {
            setLocalNotifications(prev => {
                // Keep local unreads that might not have synced yet
                const localIds = new Set(serverNotifications.map(n => n._id));
                const uniqueLocals = prev.filter(n => !localIds.has(n._id));
                return [...uniqueLocals, ...serverNotifications].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            });
        }
    }, [serverNotifications]);

    useEffect(() => {
        if (!adminProfile?.id || !process.env.NEXT_PUBLIC_API_URL) return;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const socketUrl = baseUrl.replace("/api", "");

        const socket: Socket = io(socketUrl, {
            withCredentials: true,
            transports: ["websocket"], // websocket-only: avoids HTTP polling fallback that can spike backend CPU
        });

        socket.on("connect", () => {
            console.log("[Socket] Admin connected:", socket.id);
            // Ensure we join the specific admin room
            socket.emit("join", `admin_${adminProfile.id}`);
        });

        const handleNewNotification = (notif: AdminNotification) => {
            console.log("[Socket] New admin notification received:", notif);
            setLocalNotifications(prev => {
                // Prevent duplicates
                if (prev.find(n => n._id === notif._id)) return prev;
                return [notif, ...prev].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            });
            // Show browser notification if permitted
            if (Notification.permission === "granted") {
                new Notification(notif.event, {
                    body: notif.payload?.description || "New system update",
                });
            }
        };

        socket.on("admin_notification", handleNewNotification);
        socket.on("provider_submitted", (data) => {
            handleNewNotification({
                _id: `temp_${Date.now()}`,
                event: "Provider Submitted",
                payload: { description: `${data.providerName} submitted for verification` },
                read: false,
                createdAt: new Date().toISOString()
            });
        });

        socket.on("new_complaint", (data) => {
            handleNewNotification({
                _id: `temp_${Date.now()}`,
                event: "New Complaint",
                payload: { description: `Urgent ${data.category} complaint received` },
                read: false,
                createdAt: new Date().toISOString()
            });
        });

        socket.on("new_review", (data) => {
            handleNewNotification({
                _id: `temp_${Date.now()}`,
                event: "new_review",
                payload: { description: `New ${data.rating}-star review received` },
                read: false,
                createdAt: new Date().toISOString()
            });
        });

        socket.on("system_alert", (data) => {
            handleNewNotification({
                _id: `temp_${Date.now()}`,
                event: "system_alert",
                payload: { description: `System ${data.level}: ${data.message}` },
                read: false,
                createdAt: new Date().toISOString()
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [adminProfile?.id]);

    const markAsRead = useCallback(async (id: string) => {
        setLocalNotifications(prev =>
            prev.map(n => n._id === id ? { ...n, read: true } : n)
        );

        if (id.startsWith("temp_")) return; // Don't try to sync temp items

        try {
            await patch(`/notifications/me/admin/${id}/read`, {});
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } catch (err) {
            console.error("[Notifications] Failed to mark as read on server:", err);
        }
    }, []);

    const markByEvent = useCallback(async (event: string) => {
        setLocalNotifications(prev =>
            prev.map(n => n.event === event ? { ...n, read: true } : n)
        );
        try {
            await patch(`/notifications/me/admin/mark-event-read/${event}`, {});
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } catch (err) {
            console.error(`[Notifications] Failed to mark ${event} as read:`, err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await patch(`/notifications/me/admin/mark-all-read`, {});
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } catch (err) {
            console.error("[Notifications] Failed to mark all as read on server:", err);
        }
    }, []);

    const unreadCount = localNotifications.filter(n => !n.read).length;

    return {
        notifications: localNotifications.slice(0, 50),
        unreadCount,
        isLoading,
        markAsRead,
        markByEvent,
        markAllAsRead
    };
}
