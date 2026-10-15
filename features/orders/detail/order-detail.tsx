"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { orderService } from "@/lib/services/order-service";
import { paymentService } from "@/lib/services/payment-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { OrderDetailView } from "@/features/orders/detail/order-detail-view";

import type { Order } from "@/types/order";

interface OrderDetailProps {
    orderId: number;
}

function getHttpStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    if (!("status" in error)) {
        return undefined;
    }

    const status = error.status;

    return typeof status === "number" ? status : undefined;
}

function getPaymentErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as {
            errors?: {
                payment?: string[];
            };
        };

        const paymentError = apiError.errors?.payment?.[0];

        if (paymentError) {
            return paymentError;
        }
    }

    return "Failed to start payment. Please try again.";
}

export function OrderDetail({ orderId }: OrderDetailProps) {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);

    const [order, setOrder] = useState<Order | null>(null);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

    const loadOrder = useCallback(async () => {
        if (!token) {
            return;
        }

        if (!Number.isSafeInteger(orderId) || orderId < 1) {
            setErrorMessage("Invalid order ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await orderService.getUserOrderById(
                token,
                orderId
            );

            setOrder(response.data);
        } catch (error) {
            console.error("Failed to load order details:", error);

            if (getHttpStatus(error) === 401) {
                router.replace("/auth/login");
                return;
            }

            setErrorMessage(
                "Failed to load order details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [token, orderId, router]);

    useEffect(() => {
        void loadOrder();
    }, [loadOrder]);

    async function payNow(): Promise<void> {
        if (!token || paymentLoading) {
            return;
        }

        const payment = order?.payment;

        if (!payment) {
            setPaymentErrorMessage(
                "Payment information is not available."
            );
            return;
        }

        if (
            payment.payment_status !== "unpaid" ||
            order?.status === "cancelled"
        ) {
            return;
        }

        setPaymentLoading(true);
        setPaymentErrorMessage("");

        try {
            const response = await paymentService.getSnapToken(
                token,
                payment.id
            );

            await paymentService.loadSnapScript();

            paymentService.openPayment(
                response.data.snap_token,
                {
                    onSuccess: () => {
                        setPaymentLoading(false);
                        void loadOrder();
                    },

                    onPending: () => {
                        setPaymentLoading(false);
                        void loadOrder();
                    },

                    onError: () => {
                        setPaymentLoading(false);
                        setPaymentErrorMessage(
                            "Payment failed. Please try again."
                        );
                    },

                    onClose: () => {
                        setPaymentLoading(false);
                    },
                }
            );
        } catch (error) {
            console.error("Failed to start payment:", error);

            setPaymentLoading(false);
            setPaymentErrorMessage(
                getPaymentErrorMessage(error)
            );
        }
    }

    return (
        <OrderDetailView
            order={order}
            loading={loading}
            errorMessage={errorMessage}
            paymentLoading={paymentLoading}
            paymentErrorMessage={paymentErrorMessage}
            onRetry={loadOrder}
            onPayNow={payNow}
        />
    );
}
