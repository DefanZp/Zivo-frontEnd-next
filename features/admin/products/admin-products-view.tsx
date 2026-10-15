"use client";

import {
    AlertCircle,
    ImageIcon,
    PackagePlus,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import type { Product } from "@/types/product";

interface AdminProductsViewProps {
    products: Product[];
    loading: boolean;
    errorMessage: string;
    currentPage: number;
    lastPage: number;
    onRetry: () => void;
    onPageChange: (page: number) => void;
    onCreateProduct: () => void;
    onEditProduct: (productId: number) => void;
    onDeleteProduct: (productId: number) => void;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

function formatPrice(price: string | number) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return "—";
    }

    return currencyFormatter.format(amount);
}

function ProductTableSkeleton() {
    return (
        <div className="space-y-4 p-5">
            {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Skeleton className="size-12 shrink-0 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24" />
                </div>
            ))}
        </div>
    );
}

export default function AdminProductsView({
    products,
    loading,
    errorMessage,
    currentPage,
    lastPage,
    onRetry,
    onPageChange,
    onCreateProduct,
    onEditProduct,
    onDeleteProduct,
}: AdminProductsViewProps) {
    return (
        <section
            id="admin-products-section"
            className="scroll-mt-12 py-12"
        >
            <div className="container mx-auto space-y-8 px-5">
                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                            Store management / Products
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                            Products
                        </h1>

                        <p className="text-sm text-ink-500">
                            Manage your product catalog, pricing, and stock.
                        </p>
                    </div>

                    <Button onClick={onCreateProduct}>
                        <Plus className="size-4" />
                        Add product
                    </Button>
                </div>

                {/* Product table */}
                <Card className="gap-0 border-ink-200 py-0 shadow-sm">
                    <CardHeader className="border-b border-ink-100 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-ink-100">
                                <PackagePlus className="size-5 text-ink-700" />
                            </div>

                            <div className="space-y-1">
                                <CardTitle>Product catalog</CardTitle>
                                <CardDescription>
                                    View and manage products in your store.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <ProductTableSkeleton />
                        ) : errorMessage ? (
                            <div className="p-5">
                                <Alert variant="destructive">
                                    <AlertCircle className="size-4" />
                                    <AlertTitle>
                                        Unable to load products
                                    </AlertTitle>
                                    <AlertDescription>
                                        <p>{errorMessage}</p>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={onRetry}
                                        >
                                            <RefreshCw className="size-4" />
                                            Try again
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center px-5 py-16 text-center">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-ink-100">
                                    <ImageIcon className="size-6 text-ink-500" />
                                </div>

                                <h2 className="mt-4 text-base font-semibold text-ink-950">
                                    No products available
                                </h2>

                                <p className="mt-2 max-w-sm text-sm text-ink-500">
                                    Your product catalog is empty. Add your
                                    first product to get started.
                                </p>

                                <Button
                                    className="mt-5"
                                    onClick={onCreateProduct}
                                >
                                    <Plus className="size-4" />
                                    Add product
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] table-fixed text-sm">
                                        <colgroup>
                                            <col className="w-[88px]" />
                                            <col />
                                            <col className="w-[150px]" />
                                            <col className="w-[145px]" />
                                            <col className="w-[100px]" />
                                            <col className="w-[150px]" />
                                        </colgroup>

                                        <thead className="bg-ink-50 text-ink-500">
                                            <tr>
                                                <th className="px-5 py-3 text-left font-medium">
                                                    Image
                                                </th>
                                                <th className="px-5 py-3 text-left font-medium">
                                                    Product
                                                </th>
                                                <th className="px-5 py-3 text-left font-medium">
                                                    Category
                                                </th>
                                                <th className="px-5 py-3 text-left font-medium">
                                                    Price
                                                </th>
                                                <th className="px-5 py-3 text-left font-medium">
                                                    Stock
                                                </th>
                                                <th className="px-5 py-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-ink-100">
                                            {products.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="transition hover:bg-ink-50/70"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="size-12 overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    loading="lazy"
                                                                    className="size-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex size-full items-center justify-center">
                                                                    <ImageIcon className="size-5 text-ink-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="line-clamp-2 font-medium text-ink-950">
                                                            {product.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-ink-500">
                                                            ID: {product.id}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className="text-ink-700">
                                                            {product.category?.name ?? "Uncategorized"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 font-medium tabular-nums text-ink-950">
                                                        {formatPrice(product.price)}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                product.stock === 0
                                                                    ? "border-red-200 bg-red-50 text-red-700"
                                                                    : product.stock <= 20
                                                                        ? "border-amber-200 bg-amber-50 text-amber-700"
                                                                        : "border-ink-200 bg-ink-50 text-ink-700"
                                                            }
                                                        >
                                                            {product.stock}
                                                        </Badge>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                aria-label={`Edit ${product.name}`}
                                                                onClick={() =>
                                                                    onEditProduct(product.id)
                                                                }
                                                            >
                                                                <Pencil className="size-3.5" />
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                aria-label={`Delete ${product.name}`}
                                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() =>
                                                                    onDeleteProduct(product.id)
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-ink-100 px-5 py-4">
                                    <Pagination
                                        currentPage={currentPage}
                                        lastPage={lastPage}
                                        loading={loading}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
