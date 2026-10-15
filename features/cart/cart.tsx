"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cartService } from "@/lib/services/cart-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import type { CartItem } from "@/types/cart";
import { CartView } from "./cart-view";

type CartAction = "increase" | "decrease" | "remove";

function getErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as {
            message?: string;
            errors?: Record<string, string[]>;
        };

        const validationMessage = apiError.errors
            ? Object.values(apiError.errors).flat()[0]
            : undefined;

        if (validationMessage) {
            return validationMessage;
        }

        if (apiError.message) {
            return apiError.message;
        }
    }

    return "Something went wrong. Please try again.";
}

export function Cart() {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingProductId, setUpdatingProductId] =
        useState<number | null>(null);

    const loadCart = useCallback(async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await cartService.getCart(token);

            setCartItems(response.data.items);
        } catch (error: unknown) {
            console.error("Failed to load cart:", error);

            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        void loadCart();
    }, [loadCart]);

    async function handleCartAction(
        productId: number,
        action: CartAction
    ): Promise<void> {
        if (!token || updatingProductId !== null) {
            return;
        }

        setUpdatingProductId(productId);
        setErrorMessage("");

        try {
            let response;

            if (action === "increase") {
                response = await cartService.increaseQuantity(
                    token,
                    productId
                );
            } else if (action === "decrease") {
                response = await cartService.decreaseQuantity(
                    token,
                    productId
                );
            } else {
                response = await cartService.removeFromCart(
                    token,
                    productId
                );
            }

            setCartItems(response.data.items);

            if (action === "remove") {
                toast.success("Product removed from cart.");
            }
        } catch (error: unknown) {
            console.error("Failed to update cart:", error);

            toast.error(getErrorMessage(error));
        } finally {
            setUpdatingProductId(null);
        }
    }

    function handleRetry(): void {
        void loadCart();
    }

    const cartTotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.product.price) * item.quantity,
        0
    );

    function handleCheckout(): void {
        router.push("/checkout");
    }

    return (
        <CartView
            cartItems={cartItems}
            cartTotal={cartTotal}
            loading={loading}
            errorMessage={errorMessage}
            updatingProductId={updatingProductId}
            onRetry={handleRetry}
            onIncrease={(productId) =>
                void handleCartAction(productId, "increase")
            }
            onDecrease={(productId) =>
                void handleCartAction(productId, "decrease")
            }
            onRemove={(productId) =>
                void handleCartAction(productId, "remove")
            }
            onCheckout={handleCheckout}
        />
    );
}
