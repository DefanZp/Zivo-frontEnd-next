import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type {
    CheckoutOrder,
    CheckoutRequest,
} from "@/types/checkout";

export const checkoutService = {
    createOrder(token: string, data: CheckoutRequest) {
        return apiClient<ApiResponse<CheckoutOrder>>("/orders", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    },
};