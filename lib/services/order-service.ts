import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type {
    Order,
    OrderStatus,
    PaginatedResponse,
} from "@/types/order";

export const orderService = {
    // Customer: get paginated orders.
    getUserOrders(token: string, page: number = 1) {
        return apiClient<ApiResponse<PaginatedResponse<Order>>>(
            `/orders?page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    // Customer: get a single order.
    getUserOrderById(token: string, orderId: number) {
        return apiClient<ApiResponse<Order>>(
            `/orders/${orderId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    // Admin: get paginated orders.
    getAdminOrders(token: string, page: number = 1) {
        return apiClient<ApiResponse<PaginatedResponse<Order>>>(
            `/admin/orders?page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    
    // Admin: get order detail.
    getAdminOrderById(token: string, orderId: number) {
        return apiClient<ApiResponse<Order>>(
            `/admin/orders/${orderId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },


    // Admin: update the status of an order.
    updateAdminOrderStatus(
        token: string,
        orderId: number,
        status: OrderStatus
    ) {
        return apiClient<ApiResponse<Order>>(
            `/admin/orders/${orderId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            }
        );
    },
};
