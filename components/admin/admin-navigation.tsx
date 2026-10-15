
"use client";

import { useState, type ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

interface AdminNavigationProps {
    children: ReactNode;
}

export function AdminNavigation({
    children,
}: AdminNavigationProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
        useState(false);

    function toggleMobileSidebar() {
        setIsMobileSidebarOpen((previous) => !previous);
    }

    function closeMobileSidebar() {
        setIsMobileSidebarOpen(false);
    }

    return (
        <div className="min-h-screen bg-[#FAFAF7]">
            <AdminSidebar
                isMobileOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
            />

            <div className="min-h-screen lg:pl-64">
                <AdminTopbar
                    onMenuClick={toggleMobileSidebar}
                />

                <div className="min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
