"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/lib/services/order-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import type { Order } from "@/types/order";

import AdminOrdersView from "./admin-orders-view";

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

export function AdminOrders() {
    const token = useAuthStore((state) => state.token);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const loadOrders = useCallback(
        async (page: number) => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMessage("");

            try {
                const response = await orderService.getAdminOrders(
                    token,
                    page
                );

                setOrders(response.data.data);
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
            } catch (error) {
                const status = getHttpStatus(error);

                if (status === 401) {
                    setErrorMessage(
                        "Your session has expired. Please log in again."
                    );
                    return;
                }

                if (status === 403) {
                    setErrorMessage(
                        "You do not have permission to view admin orders."
                    );
                    return;
                }

                setErrorMessage(
                    "Failed to load orders. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        void loadOrders(1);
    }, [loadOrders]);

    const handleStatusChange = async (
        orderId: number,
        status: string
    ) => {
        if (!token || updatingStatus) {
            return;
        }

        const currentOrder = orders.find(
            (order) => order.id === orderId
        );

        if (!currentOrder || currentOrder.status === status) {
            return;
        }

        setUpdatingStatus(true);

        try {
            const response = await orderService.updateAdminOrderStatus(
                token,
                orderId,
                status
            );

            const updatedOrder = response.data;

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                    ? {
                        ...order,
                        status: updatedOrder.status,
                        }
                        : order
                )
            );

            toast.success("Order status updated successfully.");
        } catch (error) {
            const statusCode = getHttpStatus(error);

            if (statusCode === 401) {
                toast.error(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (statusCode === 403) {
                toast.error(
                    "You do not have permission to update this order."
                );
                return;
            }

            if (statusCode === 422) {
                toast.error(
                    "This status change is not allowed for the current order or payment status."
                );
                return;
            }

            toast.error(
                "Failed to update the order status. Please try again."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    function goToPage(page: number) {
        if (
            loading ||
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        void loadOrders(page);

        document.getElementById("order-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <AdminOrdersView
            orders={orders}
            loading={loading}
            errorMessage={errorMessage}
            currentPage={currentPage}
            lastPage={lastPage}
            updatingStatus={updatingStatus}
            onRetry={() => void loadOrders(currentPage)}
            onPageChange={goToPage}
            onStatusChange={handleStatusChange}
        />
    );
}
