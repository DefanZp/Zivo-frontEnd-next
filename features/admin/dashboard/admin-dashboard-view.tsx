import Link from "next/link";

import {
    ArrowRight,
    Clock3,
    Package,
    ShoppingCart,
    Wallet,
} from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";

import {
    buttonVariants,
} from "@/components/ui/button";

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

import type { DashboardData } from "@/types/dashboard";

interface AdminDashboardViewProps {
    data: DashboardData | null;
    loading: boolean;
    errorMessage: string;
    onRetry: () => void;
}

function formatPrice(value: number | string): string {
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
    }).format(new Date(value));
}

function formatStatus(status: string): string {
    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClassName(status: string): string {
    const styles: Record<string, string> = {
        pending: "border-amber-200 bg-amber-50 text-amber-700",
        processing: "border-blue-200 bg-blue-50 text-blue-700",
        completed: "border-green-200 bg-green-50 text-green-700",
        cancelled: "border-red-200 bg-red-50 text-red-700",
    };

    return styles[status] ?? "border-ink-200 bg-ink-50 text-ink-700";
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="border-ink-200">
                        <CardHeader>
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-32" />
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-4 w-36" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-ink-200">
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 max-w-full" />
                </CardHeader>

                <CardContent className="space-y-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-10 w-full"
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export function AdminDashboardView({
    data,
    loading,
    errorMessage,
    onRetry,
}: AdminDashboardViewProps) {
    if (loading) {
        return (
            <div>
                <section className="py-12">
                    <div className="container mx-auto px-5 ">
                        <DashboardSkeleton />
                    </div>
                </section>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div>
                <section className="py-12">
                    <div className="container mx-auto px-5">
                        <Alert variant="destructive">
                            <AlertTitle>
                                Unable to load dashboard
                            </AlertTitle>

                            <AlertDescription>
                                <p>{errorMessage}</p>

                                <button
                                    type="button"
                                    onClick={onRetry}
                                    className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-current px-4 text-sm font-medium transition hover:bg-black/5"
                                >
                                    Try again
                                </button>
                            </AlertDescription>
                        </Alert>
                    </div>
                </section>
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <section className="py-12">
                    <div className="container mx-auto px-5">
                        <Alert>
                            <AlertTitle>
                                No dashboard data
                            </AlertTitle>

                            <AlertDescription>
                                Dashboard data is not available at the moment.
                            </AlertDescription>
                        </Alert>
                    </div>
                </section>
            </div>
        );
    }

    const statistics = data.statistic_data;
    const latestOrders = data.latest_orders_data ?? [];

    const statCards = [
        {
            title: "Total Products",
            value: statistics.total_products.toLocaleString("id-ID"),
            description: "Products in your catalog",
            icon: Package,
            iconClassName: "bg-blue-50 text-blue-700",
        },
        {
            title: "Total Orders",
            value: statistics.total_orders.toLocaleString("id-ID"),
            description: "Orders placed in total",
            icon: ShoppingCart,
            iconClassName: "bg-violet-50 text-violet-700",
        },
        {
            title: "Pending Orders",
            value: statistics.pending_orders.toLocaleString("id-ID"),
            description: "Orders awaiting processing",
            icon: Clock3,
            iconClassName: "bg-amber-50 text-amber-700",
        },
        {
            title: "Total Revenue",
            value: formatPrice(statistics.total_revenue),
            description: "From completed orders",
            icon: Wallet,
            iconClassName: "bg-green-50 text-green-700",
        },
    ];

    return (
        <div>
            <section className="py-12">
                <div className="container mx-auto px-5 ">
                    <main className="space-y-8">
                        {/* Page header */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                                    Store overview
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight text-ink-950">
                                    Dashboard
                                </h1>

                                <p className="max-w-2xl text-sm leading-6 text-ink-500">
                                    Monitor your store performance and keep track of
                                    the latest orders.
                                </p>
                            </div>

                            <Link
                                href="/admin/orders"
                                className={buttonVariants({
                                    variant: "outline",
                                })}
                            >
                                Manage orders
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </div>

                        {/* Statistics */}
                        <section
                            aria-label="Store statistics"
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                        >
                            {statCards.map((stat) => {
                                const Icon = stat.icon;

                                return (
                                    <Card
                                        key={stat.title}
                                        className="gap-4 border-ink-200 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                            <div className="space-y-1">
                                                <CardDescription>
                                                    {stat.title}
                                                </CardDescription>

                                                <CardTitle className="text-2xl font-semibold tracking-tight text-ink-950">
                                                    {stat.value}
                                                </CardTitle>
                                            </div>

                                            <div
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconClassName}`}
                                            >
                                                <Icon className="size-5" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <p className="text-xs text-ink-500">
                                                {stat.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </section>

                        {/* Latest orders */}
                        <Card className="gap-0 overflow-hidden border-ink-200 py-0 shadow-sm">
                            <CardHeader className="flex flex-col gap-3 border-b border-ink-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg text-ink-950">
                                        Latest Orders
                                    </CardTitle>

                                    <CardDescription>
                                        The five most recent orders across your store.
                                    </CardDescription>
                                </div>

                                <Link
                                    href="/admin/orders"
                                    className={buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                    })}
                                >
                                    View all orders
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </CardHeader>

                            <CardContent className="p-0">
                                {latestOrders.length === 0 ? (
                                    <div className="px-6 py-16 text-center">
                                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-ink-50 text-ink-500">
                                            <ShoppingCart className="size-5" />
                                        </div>

                                        <h3 className="mt-4 text-sm font-semibold text-ink-950">
                                            No orders yet
                                        </h3>

                                        <p className="mt-1 text-sm text-ink-500">
                                            New orders will appear here when customers
                                            place them.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-ink-50/70 hover:bg-ink-50/70">
                                                    <TableHead className="min-w-44 pl-6">
                                                        Customer
                                                    </TableHead>

                                                    <TableHead>Status</TableHead>

                                                    <TableHead>Total</TableHead>

                                                    <TableHead>Date</TableHead>

                                                    <TableHead className="pr-6 text-right">
                                                        Action
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {latestOrders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="pl-6">
                                                            <div className="space-y-1">
                                                                <p className="font-medium text-ink-950">
                                                                    {order.recipient_name}
                                                                </p>

                                                                <p className="text-xs text-ink-500">
                                                                    Order #{order.id}
                                                                </p>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={getStatusClassName(
                                                                    order.status
                                                                )}
                                                            >
                                                                {formatStatus(order.status)}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell className="font-medium tabular-nums text-ink-950">
                                                            {formatPrice(order.total_price)}
                                                        </TableCell>

                                                        <TableCell className="whitespace-nowrap text-ink-600">
                                                            {formatDate(order.created_at)}
                                                        </TableCell>

                                                        <TableCell className="pr-6 text-right">
                                                            <Link
                                                                href={`/admin/orders/${order.id}`}
                                                                className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 transition hover:text-ink-950"
                                                            >
                                                                View
                                                                <ArrowRight className="size-3.5" />
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </section>
        </div>
    );
}
