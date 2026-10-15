"use client";

import Link from "next/link";

import type { Payment } from "@/types/payment";

interface PaymentResultViewProps {
    gatewayOrderId: string;
    payment: Payment | null;
    loading: boolean;
    errorMessage: string;
    onRetry: () => void;
}

interface PaymentStatusInfo {
    title: string;
    message: string;
    icon: "success" | "pending" | "expired" | "cancelled" | "failed" | "unknown";
}

function getPaymentStatusInfo(
    status?: string
): PaymentStatusInfo {
    switch (status) {
        case "paid":
            return {
                title: "Payment Successful",
                message:
                    "Your payment has been submitted successfully and your order is being processed.",
                icon: "success",
            };

        case "unpaid":
            return {
                title: "Payment Pending",
                message:
                    "Your payment is still pending. Please check your order for the latest status.",
                icon: "pending",
            };

        case "expired":
            return {
                title: "Payment Expired",
                message:
                    "Your payment session has expired and the order has been cancelled.",
                icon: "expired",
            };

        case "cancelled":
            return {
                title: "Payment Cancelled",
                message:
                    "Your payment was cancelled before completion.",
                icon: "cancelled",
            };

        case "failed":
            return {
                title: "Payment Failed",
                message:
                    "Your payment could not be completed. Please try again.",
                icon: "failed",
            };

        default:
            return {
                title: "Payment Status",
                message:
                    "Your payment status is being verified.",
                icon: "unknown",
            };
    }
}

function getStatusSymbol(
    icon: PaymentStatusInfo["icon"]
): string {
    switch (icon) {
        case "success":
            return "✓";

        case "cancelled":
        case "failed":
            return "×";

        case "pending":
        case "expired":
            return "◷";

        default:
            return "!";
    }
}

function formatPrice(value: number | string): string {
    const amount = Number(value);

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);
}

export function PaymentResultView({
    gatewayOrderId,
    payment,
    loading,
    errorMessage,
    onRetry,
}: PaymentResultViewProps) {
    const statusInfo = getPaymentStatusInfo(
        payment?.payment_status
    );

    return (
        <section className="flex min-h-[70vh] items-center justify-center py-12">
            <div className="mx-auto w-full max-w-lg px-5">
                <div className="rounded-2xl border border-ink-200 bg-white p-7 text-center shadow-sm sm:p-10">
                    {loading ? (
                        <>
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-ink-200 border-t-ink-950" />

                            <p className="mt-5 text-sm text-ink-500">
                                Checking your payment status...
                            </p>
                        </>
                    ) : errorMessage ? (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-2xl text-ink-900">
                                !
                            </div>

                            <h1 className="mt-5 text-2xl font-semibold text-ink-950">
                                Unable to Check Payment
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-ink-500">
                                {errorMessage}
                            </p>

                            <button
                                type="button"
                                onClick={onRetry}
                                className="mt-6 rounded-lg bg-ink-950 px-5 py-3 text-sm font-medium text-white"
                            >
                                Try Again
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-3xl font-semibold text-ink-950">
                                {getStatusSymbol(statusInfo.icon)}
                            </div>

                            <h1 className="mt-5 text-2xl font-semibold text-ink-950">
                                {statusInfo.title}
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-500">
                                {statusInfo.message}
                            </p>

                            <div className="my-7 h-px w-full bg-ink-100" />

                            <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 text-left">
                                <p className="text-xs text-ink-400">
                                    Payment Order ID
                                </p>

                                <p className="mt-1 break-all text-sm font-medium text-ink-900">
                                    {gatewayOrderId}
                                </p>

                                {payment && (
                                    <>
                                        <p className="mt-4 text-xs text-ink-400">
                                            Payment Amount
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-ink-900">
                                            {formatPrice(payment.amount)}
                                        </p>

                                        <p className="mt-4 text-xs text-ink-400">
                                            Payment Status
                                        </p>

                                        <p className="mt-1 text-sm font-medium capitalize text-ink-900">
                                            {payment.payment_status}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                <Link
                                    href="/user/orders"
                                    className="w-full rounded-lg bg-ink-950 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-ink-800"
                                >
                                    View My Orders
                                </Link>

                                <Link
                                    href="/products"
                                    className="w-full rounded-lg border border-ink-200 px-5 py-3 text-center text-sm font-medium text-ink-900 transition-colors hover:bg-ink-50"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
