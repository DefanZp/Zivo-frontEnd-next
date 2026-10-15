
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { paymentService } from "@/lib/services/payment-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { PaymentResultView } from "@/features/payment/payment-result-view";

import type { Payment } from "@/types/payment";

interface PaymentResultProps {
    gatewayOrderId: string;
}

const POLLING_INTERVAL = 5000;

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

export function PaymentResult({
    gatewayOrderId,
}: PaymentResultProps) {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);

    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    const retryLoading = useCallback(() => {
        setRetryKey((current) => current + 1);
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }

        if (!gatewayOrderId) {
            setPayment(null);
            setErrorMessage("Payment information was not found.");
            setLoading(false);
            return;
        }

        let active = true;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        async function loadPayment(): Promise<void> {
            try {
                const response =
                    await paymentService.getPaymentByGatewayOrderId(
                        token,
                        gatewayOrderId
                    );

                if (!active) {
                    return;
                }

                const loadedPayment = response.data;

                setPayment(loadedPayment);
                setErrorMessage("");
                setLoading(false);

                if (loadedPayment.payment_status === "unpaid") {
                    timeoutId = setTimeout(() => {
                        void loadPayment();
                    }, POLLING_INTERVAL);
                }
            } catch (error) {
                if (!active) {
                    return;
                }

                console.error(
                    "Failed to load payment information:",
                    error
                );

                const status = getHttpStatus(error);

                setPayment(null);
                setLoading(false);

                if (status === 401) {
                    setErrorMessage(
                        "Your session has expired. Please log in again."
                    );
                    router.replace("/auth/login");
                    return;
                }

                if (status === 403) {
                    setErrorMessage(
                        "You do not have permission to view this payment."
                    );
                    return;
                }

                if (status === 404) {
                    setErrorMessage(
                        "Payment information could not be found."
                    );
                    return;
                }

                setErrorMessage(
                    "Failed to load payment information. Please try again."
                );
            }
        }

        setLoading(true);
        setErrorMessage("");

        void loadPayment();

        return () => {
            active = false;

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, [gatewayOrderId, token, router, retryKey]);

    return (
        <PaymentResultView
            gatewayOrderId={gatewayOrderId}
            payment={payment}
            loading={loading}
            errorMessage={errorMessage}
            onRetry={retryLoading}
        />
    );
}
