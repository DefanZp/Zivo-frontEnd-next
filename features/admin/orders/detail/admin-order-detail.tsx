"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/lib/services/order-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import type { Order, OrderStatus } from "@/types/order";

import AdminOrderDetailView from "./admin-order-detail-view";

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

interface AdminOrderDetailProps {
    id: string;
}

export function AdminOrderDetail({ id }: AdminOrderDetailProps) {
    const token = useAuthStore((state) => state.token);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const orderId = Number(id);
    const isValidOrderId = /^\d+$/.test(id) && orderId > 0;

    const loadOrder = useCallback(async () => {
        if (!isValidOrderId) {
            setErrorMessage("Invalid order ID.");
            setLoading(false);
            return;
        }

        if (!token) {
            setErrorMessage(
                "Your session has expired. Please log in again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await orderService.getAdminOrderById(
                token,
                orderId
            );

            setOrder(response.data);
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
                    "You do not have permission to view this order."
                );
                return;
            }

            if (status === 404) {
                setErrorMessage("This order could not be found.");
                return;
            }

            setErrorMessage(
                "Failed to load order details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token, isValidOrderId, orderId]);

    useEffect(() => {
        void loadOrder();
    }, [loadOrder]);

    const handleStatusChange = async (status: OrderStatus) => {
        if (!token || !order || updatingStatus) {
            return;
        }

        if (status === order.status) {
            return;
        }

        setUpdatingStatus(true);

        try {
            const response = await orderService.updateAdminOrderStatus(
                token,
                order.id,
                status
            );

            setOrder((currentOrder) => {
                if (!currentOrder) {
                    return response.data;
                }

                return {
                    ...currentOrder,
                    ...response.data,
                };
            });

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

    return (
        <AdminOrderDetailView
            order={order}
            loading={loading}
            errorMessage={errorMessage}
            updatingStatus={updatingStatus}
            onRetry={() => void loadOrder()}
            onStatusChange={handleStatusChange}
        />
    );
}