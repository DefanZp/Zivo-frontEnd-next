
"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Check,
    CreditCard,
    MapPin,
    Package,
    XCircle,
} from "lucide-react";

import type { Order } from "@/types/order";

interface OrderDetailViewProps {
    order: Order | null;
    loading: boolean;
    errorMessage: string;
    paymentLoading: boolean;
    paymentErrorMessage: string;
    onRetry: () => void;
    onPayNow: () => void;
}

type OrderStatus = "pending" | "processing" | "completed";

const statuses: OrderStatus[] = [
    "pending",
    "processing",
    "completed",
];

function formatPrice(value: string | number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getStatusLabel(status: OrderStatus): string {
    switch (status) {
        case "pending":
            return "Order Placed";
        case "processing":
            return "Processing";
        case "completed":
            return "Completed";
    }
}

function getPaymentStatusStyle(status: string): string {
    const styles: Record<string, string> = {
        unpaid: "bg-amber-50 text-amber-700",
        paid: "bg-green-50 text-green-700",
        pending: "bg-blue-50 text-blue-700",
        expired: "bg-ink-100 text-ink-600",
        failed: "bg-red-50 text-red-700",
    };

    return styles[status] ?? "bg-ink-100 text-ink-700";
}

function getOrderStatusStyle(status: string): string {
    const styles: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700",
        processing: "bg-blue-50 text-blue-700",
        completed: "bg-green-50 text-green-700",
        cancelled: "bg-red-50 text-red-700",
    };

    return styles[status] ?? "bg-ink-100 text-ink-700";
}

function formatStatus(status: string): string {
    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isStatusCompleted(
    order: Order,
    status: OrderStatus
): boolean {
    const currentIndex = statuses.indexOf(
        order.status as OrderStatus
    );

    const statusIndex = statuses.indexOf(status);

    return currentIndex >= 0 && statusIndex <= currentIndex;
}

export function OrderDetailView({
    order,
    loading,
    errorMessage,
    paymentLoading,
    paymentErrorMessage,
    onRetry,
    onPayNow,
}: OrderDetailViewProps) {
    if (loading) {
        return (
            <section className="min-h-screen bg-ink-50 py-20">
                <div
                    className="flex justify-center"
                    role="status"
                    aria-label="Loading order details"
                >
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-ink-950" />
                </div>
            </section>
        );
    }

    if (errorMessage || !order) {
        return (
            <section className="min-h-screen bg-ink-50 py-12">
                <div className="container mx-auto px-5 lg:px-0">
                    <Link
                        href="/user/orders"
                        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-950"
                    >
                        <ArrowLeft size={16} />
                        Back to My Orders
                    </Link>

                    <div className="mt-8 rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                        <h1 className="text-xl font-semibold text-ink-950">
                            Failed to load order
                        </h1>

                        <p className="mt-2 text-sm text-ink-500">
                            {errorMessage ||
                                "Order details are not available."}
                        </p>

                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-5 rounded-xl bg-ink-950 px-6 py-2.5 text-sm text-white transition hover:bg-ink-800"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const payment = order.payment;
    const isCancelled = order.status === "cancelled";

    const canPay =
        payment?.payment_status === "unpaid" &&
        !isCancelled;

    return (
        <section className="min-h-screen bg-ink-50 py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <Link
                    href="/user/orders"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-950"
                >
                    <ArrowLeft size={16} />
                    Back to My Orders
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-ink-950">
                        Order Details
                    </h1>

                    <p className="mt-1 text-sm text-ink-500">
                        {formatDate(order.created_at)}
                    </p>

                    <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusStyle(order.status)}`}
                    >
                        {formatStatus(order.status)}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Main content */}
                    <div className="space-y-6">
                        {/* Order items */}
                        <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                            <div className="border-b border-ink-100 px-6 py-5">
                                <h2 className="text-xl font-semibold text-ink-950">
                                    Order Items
                                </h2>

                                <p className="mt-1 text-xs text-ink-500">
                                    {order.items.length} item(s)
                                </p>
                            </div>

                            <div className="space-y-5 p-6">
                                {order.items.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-50">
                                                {item.product.image_url && (
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover object-center"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-ink-950">
                                                    {item.product.name}
                                                </p>

                                                <p className="mt-1 text-xs text-ink-500">
                                                    {item.quantity} ×{" "}
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-right text-sm font-semibold text-ink-950">
                                                {formatPrice(
                                                    Number(item.price) *
                                                        item.quantity
                                                )}
                                            </p>
                                        </div>

                                        {index < order.items.length - 1 && (
                                            <div className="mt-5 border-b border-ink-100" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50/50 px-6 py-5">
                                <span className="text-sm text-ink-500">
                                    Total Amount
                                </span>

                                <span className="text-xl font-semibold text-ink-950">
                                    {formatPrice(order.total_price)}
                                </span>
                            </div>
                        </section>

                        {/* Shipping address */}
                        <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                            <div className="border-b border-ink-100 px-6 py-5">
                                <h2 className="text-xl font-semibold text-ink-950">
                                    Shipping Address
                                </h2>

                                <p className="mt-1 text-xs text-ink-500">
                                    Address used for this order
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100">
                                        <MapPin
                                            size={20}
                                            className="text-ink-600"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-ink-950">
                                            {order.recipient_name}
                                        </p>

                                        <p className="mt-1 text-xs text-ink-500">
                                            {order.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-ink-100 pt-5">
                                    <p className="text-sm leading-6 text-ink-700">
                                        {order.full_address}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-ink-700">
                                        {[
                                            order.subdistrict_name,
                                            order.district_name,
                                            order.city_name,
                                            order.province_name,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>

                                    <p className="mt-1 text-xs text-ink-500">
                                        Postal Code: {order.postal_code}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Payment information */}
                        <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                            <div className="border-b border-ink-100 px-6 py-5">
                                <h2 className="text-xl font-semibold text-ink-950">
                                    Payment Information
                                </h2>

                                <p className="mt-1 text-xs text-ink-500">
                                    Details of your payment method and status
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100">
                                        <CreditCard
                                            size={20}
                                            className="text-ink-600"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-ink-500">
                                            Payment Method
                                        </p>

                                        <p className="mt-1 text-sm font-medium capitalize text-ink-950">
                                            {payment?.payment_method ||
                                                "Not selected"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3 border-t border-ink-100 pt-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-ink-500">
                                            Payment Status
                                        </span>

                                        {payment ? (
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase ${getPaymentStatusStyle(payment.payment_status)}`}
                                            >
                                                {formatStatus(
                                                    payment.payment_status
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-ink-500">
                                                Unavailable
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-3">
                                        <span className="text-sm font-medium text-ink-700">
                                            Payment Amount
                                        </span>

                                        <span className="text-lg font-semibold text-ink-950">
                                            {payment?.amount != null
                                                ? formatPrice(payment.amount)
                                                : formatPrice(0)}
                                        </span>
                                    </div>
                                </div>

                                {paymentErrorMessage && (
                                    <div
                                        role="alert"
                                        className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                    >
                                        {paymentErrorMessage}
                                    </div>
                                )}

                                {canPay && (
                                    <div className="mt-5 border-t border-ink-100 pt-5">
                                        <button
                                            type="button"
                                            onClick={onPayNow}
                                            disabled={paymentLoading}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {paymentLoading && (
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            )}

                                            {paymentLoading
                                                ? "Processing Payment..."
                                                : "Pay Now"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Order status timeline */}
                        <section className="rounded-2xl border border-ink-200 bg-white p-6">
                            <h2 className="text-xl font-semibold text-ink-950">
                                Order Status
                            </h2>

                            {isCancelled ? (
                                <div className="mt-6 flex items-start gap-3 border-t border-ink-100 pt-5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
                                        <XCircle size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-red-700">
                                            Order Cancelled
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-ink-500">
                                            This order has been cancelled.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-0">
                                    {statuses.map((status, index) => {
                                        const completed =
                                            isStatusCompleted(order, status);

                                        const current =
                                            order.status === status;

                                        return (
                                            <div
                                                key={status}
                                                className="flex gap-4"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                                            completed
                                                                ? "border-ink-950 bg-ink-950 text-white"
                                                                : "border-ink-300 bg-white text-ink-400"
                                                        }`}
                                                    >
                                                        {completed ? (
                                                            <Check size={16} />
                                                        ) : (
                                                            <span className="h-2 w-2 rounded-full bg-ink-300" />
                                                        )}
                                                    </div>

                                                    {index <
                                                        statuses.length - 1 && (
                                                        <div
                                                            className={`h-10 w-px ${
                                                                completed
                                                                    ? "bg-ink-950"
                                                                    : "bg-ink-200"
                                                            }`}
                                                        />
                                                    )}
                                                </div>

                                                <div className="pt-1">
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            completed
                                                                ? "text-ink-950"
                                                                : "text-ink-400"
                                                        }`}
                                                    >
                                                        {getStatusLabel(status)}
                                                    </p>

                                                    {current && (
                                                        <p className="mt-1 text-xs text-ink-500">
                                                            Current status
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Order information */}
                        <section className="rounded-2xl border border-ink-200 bg-white p-6">
                            <h2 className="text-xl font-semibold text-ink-950">
                                Order Information
                            </h2>

                            <div className="mt-5 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs text-ink-500">
                                        Order ID
                                    </span>

                                    <span className="text-sm font-medium text-ink-950">
                                        #{order.id}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs text-ink-500">
                                        Order Date
                                    </span>

                                    <span className="text-right text-sm text-ink-950">
                                        {new Intl.DateTimeFormat("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(order.created_at))}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs text-ink-500">
                                        Items
                                    </span>

                                    <span className="text-sm text-ink-950">
                                        {order.items.length}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                        >
                            <Package size={16} />
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
}
