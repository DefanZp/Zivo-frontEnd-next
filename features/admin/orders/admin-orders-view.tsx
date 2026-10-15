import Link from "next/link";
import {
    AlertCircle,
    ArrowRight,
    ClipboardList,
    RefreshCw,
    ShoppingCart,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Pagination } from "@/components/shared/pagination";

import type { Order } from "@/types/order";

interface AdminOrdersViewProps {
    orders: Order[];
    loading: boolean;
    errorMessage: string;
    currentPage: number;
    lastPage: number;
    updatingStatus: boolean;
    onRetry: () => void;
    onPageChange: (page: number) => void;
    onStatusChange: (orderId: number, status: string) => void;
}

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const statusStyles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    processing: "border-blue-200 bg-blue-50 text-blue-700",
    shipped: "border-violet-200 bg-violet-50 text-violet-700",
    completed: "border-green-200 bg-green-50 text-green-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Jakarta",
});

function formatPrice(value: number | string): string {
    const price = Number(value);

    if (!Number.isFinite(price)) {
        return "—";
    }

    return currencyFormatter.format(price);
}

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return dateFormatter.format(date);
}

function formatStatus(status: string): string {
    const option = statusOptions.find(
        (item) => item.value === status
    );

    if (option) {
        return option.label;
    }

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClassName(status: string): string {
    return (
        statusStyles[status] ??
        "border-ink-200 bg-ink-50 text-ink-700"
    );
}

function OrdersSkeleton() {
    return (
        <Card className="gap-0 overflow-hidden border-ink-200 py-0 shadow-sm">
            <CardHeader className="border-b border-ink-100 py-5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-64 max-w-full" />
            </CardHeader>

            <CardContent className="p-6">
                <div className="space-y-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4"
                        >
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-7 w-24 rounded-md" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyOrders() {
    return (
        <Card className="border-ink-200 shadow-sm">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-ink-50">
                    <ShoppingCart className="size-6 text-ink-500" />
                </div>

                <h2 className="mt-5 text-base font-semibold text-ink-950">
                    No orders found
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">
                    Customer orders will appear here when a new
                    order is placed.
                </p>
            </CardContent>
        </Card>
    );
}

function OrdersTable({
    orders,
    updatingStatus,
    onStatusChange,
}: {
    orders: Order[];
    updatingStatus: boolean;
    onStatusChange: (orderId: number, status: string) => void;
}) {
    return (
        <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[1000px] table-fixed">
                
                <TableHeader>
                    <TableRow className="bg-ink-50/70 hover:bg-ink-50/70">
                        <TableHead className="w-[75px] pl-6">
                            Order
                        </TableHead>

                        <TableHead className="w-[165px]">
                            Order Date
                        </TableHead>

                        <TableHead className="w-[130px]">
                            Recipient
                        </TableHead>

                        <TableHead className="w-[125px]">
                            Phone
                        </TableHead>

                        <TableHead className="w-[130px] text-right">
                            Total
                        </TableHead>

                        <TableHead className="w-[250px]">
                            Status
                        </TableHead>

                        <TableHead className="w-[125px] pr-6 text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>


                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="transition-colors"
                        >
                            <TableCell className="pl-6">
                                <span className="font-semibold text-ink-950">
                                    #{order.id}
                                </span>
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-sm text-ink-600">
                                {formatDate(order.created_at)}
                            </TableCell>

                            <TableCell>
                                <span className="font-medium text-ink-900">
                                    {order.recipient_name || "—"}
                                </span>
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-sm text-ink-600">
                                {order.phone || "—"}
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-ink-950">
                                {formatPrice(order.total_price)}
                            </TableCell>

                            <TableCell>
                                <div className="flex min-w-0 flex-col items-start gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`whitespace-nowrap ${getStatusClassName(
                                            order.status
                                        )}`}
                                    >
                                        {formatStatus(order.status)}
                                    </Badge>

                                    <select
                                        aria-label={`Update status for order ${order.id}`}
                                        value={order.status}
                                        disabled={updatingStatus}
                                        onChange={(event) =>
                                            onStatusChange(order.id, event.target.value)
                                        }
                                        className="block h-9 w-full max-w-[190px] min-w-0 rounded-lg border border-ink-200 bg-white px-2.5 text-xs text-ink-700 outline-none transition focus:border-ink-400 focus:ring-2 focus:ring-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {!statusOptions.some(
                                            (option) => option.value === order.status
                                        ) && (
                                            <option value={order.status}>
                                                {formatStatus(order.status)}
                                            </option>
                                        )}

                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </TableCell>

                            <TableCell className="whitespace-nowrap pr-6 text-right">
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    aria-label={`View order ${order.id}`}
                                    className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    })}
                                >
                                    Details
                                    <ArrowRight className="ml-1 size-3.5" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function AdminOrdersView({
    orders,
    loading,
    errorMessage,
    currentPage,
    lastPage,
    updatingStatus,
    onRetry,
    onPageChange,
    onStatusChange,
}: AdminOrdersViewProps) {
    return (
        <div>
            <section
                id="order-section"
                className="scroll-mt-12 py-12"
            >
                <div className="container mx-auto px-5">
                    <main className="space-y-8">
                        {/* Page header */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                                    Store management
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                                    Orders
                                </h1>

                                <p className="max-w-2xl text-sm leading-6 text-ink-500">
                                    Review customer orders, manage fulfillment
                                    status, and open order details.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-start rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-600 sm:self-auto">
                                <ClipboardList className="size-4 text-ink-500" />
                                <span>Order management</span>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && <OrdersSkeleton />}

                        {/* Error */}
                        {!loading && errorMessage && (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />

                                <AlertTitle>
                                    Unable to load orders
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
                        )}

                        {/* Empty state */}
                        {!loading && !errorMessage && orders.length === 0 && (
                            <EmptyOrders />
                        )}

                        {/* Orders table */}
                        {!loading && !errorMessage && orders.length > 0 && (
                            <Card className="gap-0 overflow-hidden border-ink-200 py-0 shadow-sm">
                                <CardHeader className="flex flex-col gap-3 border-b border-ink-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg text-ink-950">
                                            All Orders
                                        </CardTitle>

                                        <CardDescription>
                                            Review and update orders from your
                                            store.
                                        </CardDescription>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className="w-fit rounded-full px-3 py-1"
                                    >
                                        {orders.length} orders on this page
                                    </Badge>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <OrdersTable
                                        orders={orders}
                                        updatingStatus={updatingStatus}
                                        onStatusChange={onStatusChange}
                                    />
                                </CardContent>

                                <div className="border-t border-ink-100 px-5 py-4">
                                    <Pagination
                                        currentPage={currentPage}
                                        lastPage={lastPage}
                                        loading={loading}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            </Card>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
}
