
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type { DashboardData } from "@/types/dashboard";

export const dashboardService = {
    getDashboard(token: string) {
        return apiClient<ApiResponse<DashboardData>>(
            "/admin/dashboard",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },
};
