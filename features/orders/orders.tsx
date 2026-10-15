"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { orderService } from "@/lib/services/order-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { OrdersView } from "@/features/orders/orders-view";

import type { Order } from "@/types/order";

export function Orders() {
    const orderSection = useRef<HTMLDivElement>(null);

    const token = useAuthStore((state) => state.token);

    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadOrders = useCallback(async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await orderService.getUserOrders(
                token,
                currentPage
            );

            const pagination = response.data;

            setOrders(pagination.data ?? []);
            setCurrentPage(pagination.current_page);
            setLastPage(pagination.last_page);
        } catch (error) {
            console.error("Failed to load orders:", error);

            setErrorMessage(
                "Failed to load your orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token, currentPage]);

    useEffect(() => {
        void loadOrders();
    }, [loadOrders]);

    function goToPage(page: number): void {
        if (
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);

        orderSection.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <div ref={orderSection}>
            <OrdersView
                orders={orders}
                currentPage={currentPage}
                lastPage={lastPage}
                loading={loading}
                errorMessage={errorMessage}
                onRetry={loadOrders}
                onPageChange={goToPage}
            />
        </div>
    );
}
