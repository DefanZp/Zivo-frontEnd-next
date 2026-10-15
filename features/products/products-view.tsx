import Link from "next/link";
import { ArrowRight, ChevronDown, Search } from "lucide-react";

import type { Product, ProductCategory } from "@/types/product";
import { Pagination } from "@/components/shared/pagination";

interface SortOption {
    label: string;
    sort: string;
    direction: "asc" | "desc";
}

interface ProductsViewProps {
    products: Product[];
    categories: ProductCategory[];
    loading: boolean;
    errorMessage: string;

    search: string;
    category: string;
    sortIndex: number;

    sortOptions: readonly SortOption[];
    currentPage: number;
    lastPage: number;

    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: number) => void;
    onPageChange: (page: number) => void;
    onRetry: () => void;
}

function formatPrice(price: string) {
    return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    }).format(Number(price));
}

export function ProductsView({
    products,
    categories,
    loading,
    errorMessage,
    search,
    category,
    sortIndex,
    sortOptions,
    currentPage,
    lastPage,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onPageChange,
    onRetry,
    }: ProductsViewProps) {

    return (
    <section
        id="product-section"
        className="scroll-mt-12 py-12"
    >
        <div className="container mx-auto px-5 lg:px-0">
        {/* Search and filters */}
        <form
            className="mb-12 flex flex-col gap-4 md:flex-row"
            onSubmit={(event) => event.preventDefault()}
        >
            {/* Search input */}
            <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-ink-200 bg-white px-4 transition focus-within:border-ink-400 md:flex-1">
            <Search
                size={16}
                className="shrink-0 text-ink-400"
            />

            <input
                type="search"
                value={search}
                onChange={(event) =>
                onSearchChange(event.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
            />
            </div>

            {/* Sort dropdown */}
            <div className="relative w-full md:w-auto">
            <select
                value={sortIndex}
                onChange={(event) =>
                onSortChange(Number(event.target.value))
                }
                aria-label="Sort products"
                className="h-12 w-full appearance-none rounded-lg border border-ink-200 bg-white py-0 pr-10 pl-4 text-sm text-ink-600 outline-none transition focus:border-ink-400 md:min-w-44"
            >
                {sortOptions.map((option, index) => (
                <option key={option.label} value={index}>
                    {option.label}
                </option>
                ))}
            </select>

            <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-400"
            />
            </div>

            {/* Category dropdown */}
            <div className="relative w-full md:w-auto">
            <select
                value={category}
                onChange={(event) =>
                onCategoryChange(event.target.value)
                }
                aria-label="Filter by category"
                className="h-12 w-full appearance-none rounded-lg border border-ink-200 bg-white py-0 pr-10 pl-4 text-sm text-ink-600 outline-none transition focus:border-ink-400 md:min-w-44"
            >
                <option value="">All Categories</option>

                {categories.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.name}
                </option>
                ))}
            </select>

            <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-400"
            />
            </div>
        </form>

        {/* Products grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
                <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-ink-200"
                >
                <div className="aspect-square bg-ink-100" />

                <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded bg-ink-100" />
                    <div className="h-3 rounded bg-ink-100" />
                    <div className="h-3 w-1/2 rounded bg-ink-100" />
                    <div className="mt-4 h-6 w-1/3 rounded bg-ink-100" />
                </div>
                </div>
            ))
            ) : errorMessage ? (
            <div className="col-span-full flex flex-col items-center py-12 text-center">
                <h2 className="mb-2 text-lg font-semibold text-ink-900">
                Failed to load products
                </h2>

                <p className="mb-6 text-sm text-ink-500">
                {errorMessage}
                </p>

                <button
                type="button"
                onClick={onRetry}
                className="rounded-full bg-ink-950 px-6 py-2.5 text-sm text-white transition hover:bg-ink-800"
                >
                Try again
                </button>
            </div>
            ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center">
                <h2 className="text-lg font-semibold text-ink-900">
                No products available yet.
                </h2>
            </div>
            ) : (
            products.map((product) => (
                <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 transition-all duration-300 hover:shadow-xl"
                >
                <div className="relative aspect-square w-full overflow-hidden bg-ink-100">
                    <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                    />

                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-ink-900 backdrop-blur">
                    {product.category.name}
                    </span>

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                    <p className="line-clamp-1 text-base font-semibold capitalize text-ink-900">
                    {product.name}
                    </p>

                    <p className="mt-1 line-clamp-2 flex-1 text-sm capitalize text-ink-500">
                    {product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xl font-semibold text-ink-900">
                        {formatPrice(product.price)}
                    </p>

                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition group-hover:bg-black group-hover:text-white">
                        <ArrowRight size={16} />
                    </span>
                    </div>
                </div>
                </Link>
            ))
            )}
        </div>

        {!loading && !errorMessage && products.length > 0 && (
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={onPageChange}
            />
        )}
        </div>
    </section>
    );
}
