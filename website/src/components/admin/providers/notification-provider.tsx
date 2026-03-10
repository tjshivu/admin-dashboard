"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNotifications as useNotificationsHook, AdminNotification } from "@/hooks/admin/use-notifications";

interface NotificationContextType {
    notifications: AdminNotification[];
    unreadCount: number;
    isLoading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const notificationsState = useNotificationsHook();

    return (
        <NotificationContext.Provider value={notificationsState}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useSharedNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useSharedNotifications must be used within a NotificationProvider");
    }
    return context;
}
