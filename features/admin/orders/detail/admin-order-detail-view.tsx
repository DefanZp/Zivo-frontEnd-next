import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    CreditCard,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    UserRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Order, OrderStatus } from "@/types/order";

interface AdminOrderDetailViewProps {
    order: Order | null;
    loading: boolean;
    errorMessage: string;
    updatingStatus: boolean;
    onRetry: () => void;
    onStatusChange: (status: OrderStatus) => void;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
});

const statusStyles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    processing: "border-blue-200 bg-blue-50 text-blue-700",
    shipped: "border-violet-200 bg-violet-50 text-violet-700",
    completed: "border-green-200 bg-green-50 text-green-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
};

function formatPrice(value: number | string | undefined): string {
    const amount = Number(value);

    if (value === undefined || !Number.isFinite(amount)) {
        return "—";
    }

    return currencyFormatter.format(amount);
}

function formatDate(value: string | undefined): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return dateFormatter.format(date);
}

function formatLabel(value: string | null | undefined): string {
    if (!value) {
        return "Unknown";
    }

    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClassName(status: string): string {
    return (
        statusStyles[status] ??
        "border-ink-200 bg-ink-50 text-ink-700"
    );
}


function getAllowedStatuses(order: Order): OrderStatus[] {
    const paymentStatus = order.payment?.payment_status;

    if (order.status === "pending") {
        const allowedStatuses: OrderStatus[] = [];

        if (paymentStatus === "paid") {
            allowedStatuses.push("processing");
        }

        if (paymentStatus !== "paid") {
            allowedStatuses.push("cancelled");
        }

        return allowedStatuses;
    }

    if (order.status === "processing") {
        const allowedStatuses: OrderStatus[] = ["completed"];

        if (paymentStatus !== "paid") {
            allowedStatuses.push("cancelled");
        }

        return allowedStatuses;
    }

    return [];
}


function DetailSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-72 max-w-full" />
                <Skeleton className="h-4 w-56 max-w-full" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
                <Skeleton className="h-64 rounded-xl" />
            </div>

            <Skeleton className="h-72 rounded-xl" />
        </div>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <span className="text-sm text-ink-500">{label}</span>
            <span className="break-words text-sm font-medium text-ink-900 sm:max-w-[65%] sm:text-right">
                {value || "—"}
            </span>
        </div>
    );
}

function ShippingCard({ order }: { order: Order }) {
    return (
        <Card className="gap-0 border-ink-200 py-0 shadow-sm">
            <CardHeader className="border-b border-ink-100 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-ink-100">
                        <MapPin className="size-5 text-ink-700" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>
                            Recipient and delivery address
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 p-5">
                <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 size-4 shrink-0 text-ink-400" />
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-semibold text-ink-950">
                            {order.recipient_name || "—"}
                        </p>
                        <p className="text-sm text-ink-500">
                            Recipient
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-ink-400" />
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="break-all text-sm font-medium text-ink-900">
                            {order.phone || "—"}
                        </p>
                        <p className="text-xs text-ink-500">
                            Phone number
                        </p>
                    </div>
                </div>

                <div className="border-t border-ink-100 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Delivery address
                    </p>

                    <p className="text-sm leading-6 text-ink-800">
                        {order.full_address || "—"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-ink-600">
                        {[
                            order.district_name,
                            order.city_name,
                            order.province_name,
                        ]
                            .filter(Boolean)
                            .join(", ") || "—"}
                    </p>

                    {order.subdistrict_name && (
                        <p className="mt-1 text-sm text-ink-600">
                            Subdistrict: {order.subdistrict_name}
                        </p>
                    )}

                    <p className="mt-1 text-sm text-ink-600">
                        Postal code: {order.postal_code || "—"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function PaymentCard({ order }: { order: Order }) {
    const payment = order.payment;

    return (
        <Card className="gap-0 border-ink-200 py-0 shadow-sm">
            <CardHeader className="border-b border-ink-100 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-ink-100">
                        <CreditCard className="size-5 text-ink-700" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>
                            Payment method and current status
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5">
                <DetailRow
                    label="Payment method"
                    value={formatLabel(payment?.payment_method)}
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-ink-500">
                        Payment status
                    </span>

                    <Badge
                        variant="outline"
                        className={getStatusClassName(
                            payment?.payment_status ?? "unknown"
                        )}
                    >
                        {formatLabel(payment?.payment_status)}
                    </Badge>
                </div>

                <div className="border-t border-ink-100 pt-4">
                    <p className="text-sm text-ink-500">
                        Payment amount
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-950">
                        {formatPrice(payment?.amount)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function OrderSummaryCard({
    order,
    updatingStatus,
    onStatusChange,
}: {
    order: Order;
    updatingStatus: boolean;
    onStatusChange: (status: OrderStatus) => void;
}) {
    const allowedStatuses = getAllowedStatuses(order);

    return (
        <Card className="h-fit gap-0 border-ink-200 py-0 shadow-sm">
            <CardHeader className="border-b border-ink-100 py-5">
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                    Overview and order status
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-5">
                <div className="space-y-2">
                    <p className="text-sm text-ink-500">
                        Current status
                    </p>
                    <Badge
                        variant="outline"
                        className={getStatusClassName(order.status)}
                    >
                        {formatLabel(order.status)}
                    </Badge>
                </div>

                <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 text-ink-400" />
                    <div className="min-w-0">
                        <p className="text-xs text-ink-500">
                            Order date
                        </p>
                        <p className="mt-1 text-sm font-medium text-ink-900">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                </div>

                <div className="border-t border-ink-100 pt-4">
                    <p className="text-sm text-ink-500">
                        Total order
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-950">
                        {formatPrice(order.total_price)}
                    </p>
                </div>

                <div className="space-y-4 border-t border-ink-100 pt-4">
                    <label
                        htmlFor="order-status"
                        className="block text-sm font-medium text-ink-900"
                    >
                        Update status
                    </label>

                    <select
                        id="order-status"
                        value=""
                        disabled={
                            updatingStatus ||
                            allowedStatuses.length === 0
                        }
                        onChange={(event) => {
                            const selectedStatus = allowedStatuses.find(
                                (status) => status === event.target.value
                            );

                            if (selectedStatus) {
                                onStatusChange(selectedStatus);
                            }
                        }}
                        className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-800 outline-none transition focus:border-ink-400 focus:ring-2 focus:ring-ink-100 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
                    >
                        <option value="">
                            {updatingStatus
                                ? "Updating status..."
                                : allowedStatuses.length > 0
                                    ? "Choose next status"
                                    : "No further changes allowed"}
                        </option>

                        {allowedStatuses.map((status) => (
                            <option key={status} value={status}>
                                {formatLabel(status)}
                            </option>
                        ))}
                    </select>

                    {allowedStatuses.length === 0 && (
                        <p className="text-xs leading-5 text-ink-500">
                            This order has reached a final status.
                        </p>
                    )}

                    {allowedStatuses.includes("processing") && (
                        <p className="text-xs leading-5 text-ink-500">
                            Only paid orders can be moved to processing.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function OrderItemsCard({ order }: { order: Order }) {
    const items = order.items ?? [];

    return (
        <Card className="gap-0 border-ink-200 py-0 shadow-sm">
            <CardHeader className="border-b border-ink-100 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-ink-100">
                        <Package className="size-5 text-ink-700" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription>
                            {items.length} product
                            {items.length === 1 ? "" : "s"} in this order
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5">
                {items.length === 0 ? (
                    <p className="py-6 text-center text-sm text-ink-500">
                        No items found for this order.
                    </p>
                ) : (
                    <div className="divide-y divide-ink-100">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 py-4 first:pt-0 last:pb-0"
                            >
                                <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
                                    {item.product?.image_url ? (
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            loading="lazy"
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <Package className="size-6 text-ink-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                                    <p className="line-clamp-2 text-sm font-semibold text-ink-950">
                                        {item.product?.name ?? "Product unavailable"}
                                    </p>

                                    <p className="text-sm text-ink-500">
                                        {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center text-right">
                                    <p className="text-sm font-semibold tabular-nums text-ink-950">
                                        {formatPrice(
                                            Number(item.price) * item.quantity
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-ink-200 pt-5">
                    <span className="text-sm font-medium text-ink-600">
                        Order total
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-ink-950">
                        {formatPrice(order.total_price)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function OrderDetailView({
    order,
    loading,
    errorMessage,
    updatingStatus,
    onRetry,
    onStatusChange,
}: AdminOrderDetailViewProps) {
    return (
        <div>
            <section className="py-12">
                <div className="container mx-auto px-5">
                    <main className="space-y-8">
                        {loading ? (
                            <DetailSkeleton />
                        ) : errorMessage ? (
                            <Alert variant="destructive">
                                <AlertTitle>
                                    Unable to load order details
                                </AlertTitle>

                                <AlertDescription>
                                    <p>{errorMessage}</p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onRetry}
                                        className="mt-4"
                                    >
                                        <RefreshCw className="mr-2 size-4" />
                                        Try again
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        ) : order ? (
                            <>
                                <div className="space-y-5">
                                    <Link
                                        href="/admin/orders"
                                        className={buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                        })}
                                    >
                                        <ArrowLeft className="mr-2 size-4" />
                                        Back to Orders
                                    </Link>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                                                Store management / Orders
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                                                    Order #{order.id}
                                                </h1>

                                                <Badge
                                                    variant="outline"
                                                    className={getStatusClassName(order.status)}
                                                >
                                                    {formatLabel(order.status)}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-ink-500">
                                                Review order information,
                                                payment, and fulfillment.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                                    <div className="min-w-0 space-y-6">
                                        <ShippingCard order={order} />
                                        <PaymentCard order={order} />
                                    </div>

                                    <OrderSummaryCard
                                        order={order}
                                        updatingStatus={updatingStatus}
                                        onStatusChange={onStatusChange}
                                    />
                                </div>

                                <OrderItemsCard order={order} />
                            </>
                        ) : (
                            <Alert>
                                <AlertTitle>
                                    Order details unavailable
                                </AlertTitle>
                                <AlertDescription>
                                    No order data was returned by the server.
                                </AlertDescription>
                            </Alert>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
}
