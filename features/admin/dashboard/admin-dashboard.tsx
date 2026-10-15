
"use client";

import { useCallback, useEffect, useState } from "react";

import { dashboardService } from "@/lib/services/dashboard-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { AdminDashboardView } from "@/features/admin/dashboard/admin-dashboard-view";

import type { DashboardData } from "@/types/dashboard";

function getHttpStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    if (!("status" in error)) {
        return undefined;
    }

    const status = (error as { status?: unknown }).status;

    return typeof status === "number" ? status : undefined;
}

export function AdminDashboard() {
    const token = useAuthStore((state) => state.token);

    const [dashboardData, setDashboardData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDashboard = useCallback(async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await dashboardService.getDashboard(token);

            setDashboardData(response.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);

            const status = getHttpStatus(error);

            if (status === 401) {
                setErrorMessage(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (status === 403) {
                setErrorMessage(
                    "You do not have permission to access the admin dashboard."
                );
                return;
            }

            setErrorMessage(
                "Failed to load the dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    return (
        <AdminDashboardView
            data={dashboardData}
            loading={loading}
            errorMessage={errorMessage}
            onRetry={() => void loadDashboard()}
        />
    );
}
