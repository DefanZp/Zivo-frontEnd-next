"use client";

import Image from "next/image";
import Link from "next/link";

import type { Order } from "@/types/order";
import { Pagination } from "@/components/shared/pagination";

interface OrdersViewProps {
    orders: Order[];
    currentPage: number;
    lastPage: number;
    loading: boolean;
    errorMessage: string;
    onRetry: () => void;
    onPageChange: (page: number) => void;
}

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

function getStatusStyle(status: string): string {
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

export function OrdersView({
    orders,
    currentPage,
    lastPage,
    loading,
    errorMessage,
    onRetry,
    onPageChange,
}: OrdersViewProps) {
    return (
        <section className="min-h-screen scroll-mt-12 bg-ink-50 py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <h1 className="mb-8 text-3xl font-semibold text-ink-950">
                    My Orders
                </h1>

                {loading ? (
                    <div
                        className="flex items-center justify-center py-12"
                        role="status"
                    >
                        <span className="text-sm text-ink-500">
                            Loading orders...
                        </span>
                    </div>
                ) : errorMessage ? (
                    <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                        <h2 className="text-lg font-semibold text-ink-950">
                            Failed to load orders
                        </h2>

                        <p className="mt-2 text-sm text-ink-500">
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-5 rounded-xl bg-ink-950 px-6 py-2.5 text-sm text-white transition hover:bg-ink-800"
                        >
                            Try again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-ink-200 bg-white px-6 py-16 text-center">
                        <h2 className="text-lg font-semibold text-ink-950">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-sm text-ink-500">
                            You haven&apos;t placed any orders yet.
                        </p>

                        <Link
                            href="/products"
                            className="mt-5 inline-flex rounded-xl bg-ink-950 px-5 py-2.5 text-sm text-white transition hover:bg-ink-800"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition hover:border-ink-300"
                            >
                                <div className="flex flex-col justify-between gap-3 border-b border-ink-100 bg-ink-50/50 px-6 py-4 md:flex-row md:items-center">
                                    <div>
                                        <span className="text-xs text-ink-400">
                                            Order #{order.id}
                                        </span>

                                        <p className="mt-0.5 text-sm font-medium text-ink-950">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}
                                    >
                                        {formatStatus(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-4 p-6">
                                    {order.items.map((item, index) => (
                                        <div key={item.id}>
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
                                                    {item.product.image_url && (
                                                        <Image
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover object-center"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-ink-950">
                                                        {item.product.name}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                                                        <span className="font-medium text-ink-700">
                                                            {item.quantity}x
                                                        </span>

                                                        <span>•</span>

                                                        <span>
                                                            {formatPrice(item.price)}
                                                        </span>
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
                                                <div className="mt-4 border-b border-ink-100" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between gap-4 border-t border-ink-100 bg-ink-50/40 px-6 py-4">
                                    <div>
                                        <span className="block text-xs text-ink-500">
                                            Total Amount
                                        </span>

                                        <span className="mt-1 block text-base font-semibold text-ink-950">
                                            {formatPrice(order.total_price)}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/user/orders/${order.id}`}
                                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-ink-800"
                                    >
                                        View Details
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && !errorMessage && lastPage > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        loading={loading}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </section>
    );
}
