
import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api-response";
import type { Cart } from "@/types/cart";

export const cartService = {
    getCart(token: string) {
        return apiClient<ApiResponse<Cart>>("/cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    addToCart(
        token: string,
        productId: number,
        quantity: number = 1
    ) {
        return apiClient<ApiResponse<Cart>>("/cart/items", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id: productId,
                quantity,
            }),
        });
    },

    increaseQuantity(token: string, productId: number) {
        return apiClient<ApiResponse<Cart>>(
            `/cart/items/${productId}/increase`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            }
        );
    },

    decreaseQuantity(token: string, productId: number) {
        return apiClient<ApiResponse<Cart>>(
            `/cart/items/${productId}/decrease`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            }
        );
    },

    removeFromCart(token: string, productId: number) {
        return apiClient<ApiResponse<Cart>>(
            `/cart/items/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    clearCart(token: string) {
        return apiClient<ApiResponse<Cart>>("/cart", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};
