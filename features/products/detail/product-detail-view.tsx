import {
    CheckCircle2,
    LoaderCircle,
    ShoppingCart,
} from "lucide-react";

import type { Product, ProductSpecificationValue } from "@/types/product";

interface ProductDetailViewProps {
    product: Product | null;
    loading: boolean;
    errorMessage: string;
    addingToCart: boolean;
    checkingCart: boolean;
    isInCart: boolean;
    onRetry: () => void;
    onAddToCart: () => void | Promise<void>;
}

function formatPrice(price: string) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(price));
}

function formatSpecificationLabel(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSpecificationValue(
    value: ProductSpecificationValue
): string {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (value === null) {
        return "";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value).trim();
}

export function ProductDetailView({
    product,
    loading,
    errorMessage,
    addingToCart,
    checkingCart,
    isInCart,
    onRetry,
    onAddToCart,
}: ProductDetailViewProps) {

    const specifications = Object.entries(
    product?.specifications ?? {}
    )
        .map(([key, value]) => ({
            key,
            label: formatSpecificationLabel(key),
            value: formatSpecificationValue(value),
        }))
        .filter((item) => item.value !== "");

    return (
        <section className="py-12">
            <div className="container mx-auto px-5 lg:px-0">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle
                            size={32}
                            className="animate-spin text-ink-500"
                        />
                    </div>
                ) : errorMessage ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-ink-200 bg-white p-8 shadow-xs">
                        <div className="text-center">
                            <h2 className="mb-2 text-lg font-semibold text-ink-900">
                                Failed to load product details
                            </h2>

                            <p className="text-sm text-ink-500">
                                {errorMessage}
                            </p>

                            <button
                                type="button"
                                onClick={onRetry}
                                className="mt-4 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 active:scale-95"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : product ? (
                    <div className="flex flex-col items-start gap-8 lg:flex-row">
                        {/* Product image */}
                        <div className="w-full overflow-hidden rounded-2xl border border-ink-200 bg-white p-3 shadow-xs lg:w-[62%]">
                            <div className="relative h-[250px] w-full overflow-hidden rounded-xl md:h-[300px] lg:h-[400px]">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full rounded-xl object-cover object-center"
                                />

                                <span className="absolute top-4 left-4 rounded-full border border-ink-200 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-ink-900 shadow-xs backdrop-blur-md">
                                    {product.category.name}
                                </span>
                            </div>
                        </div>

                        {/* Product information */}
                        <div className="flex w-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-xs lg:w-[38%]">
                            <h1 className="text-3xl font-extrabold text-ink-900">
                                {product.name}
                            </h1>

                            <div className="mt-4 flex justify-between gap-4 border-b border-ink-100 pb-6">
                                <p className="text-2xl font-black text-ink-900">
                                    {formatPrice(product.price)}
                                </p>

                                <div className="flex shrink-0 items-center gap-2">
                                    <span
                                        className={`relative size-2.5 rounded-full ${
                                            product.stock > 0
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                        }`}
                                    />

                                    <span className="text-xs font-medium text-ink-600">
                                        {product.stock > 0
                                            ? `In Stock (${product.stock})`
                                            : "Out of Stock"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-b border-ink-100 py-6">
                                <h2 className="mb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                    Description
                                </h2>

                                <p className="whitespace-pre-line text-sm text-ink-600">
                                    {product.description}
                                </p>
                            </div>

                            {/* Product specifications */}
                            {specifications.length > 0 && (
                                <div className="border-b border-ink-100 py-6">
                                    <h2 className="mb-3 text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                        Product Specifications
                                    </h2>

                                    <dl className="divide-y divide-ink-100">
                                        {specifications.map((item) => (
                                            <div
                                                key={item.key}
                                                className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3 text-sm"
                                            >
                                                <dt className="text-ink-500">
                                                    {item.label}
                                                </dt>

                                                <dd className="break-words font-medium text-ink-800">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            {/* Cart integration */}
                            <div className="mt-auto pt-6">
                                <button
                                    type="button"
                                    onClick={() => void onAddToCart()}
                                    disabled={
                                        addingToCart ||
                                        checkingCart ||
                                        product.stock <= 0
                                    }
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        isInCart && product.stock > 0
                                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "bg-ink-900 text-white hover:bg-ink-800"
                                    }`}
                                >
                                    {checkingCart || addingToCart ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />

                                            {checkingCart ? "Checking Cart..." : "Adding..."}
                                        </>
                                    ) : product.stock <= 0 ? (
                                        <>
                                            <ShoppingCart size={18} />
                                            Out of Stock
                                        </>
                                    ) : isInCart ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Already in Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}