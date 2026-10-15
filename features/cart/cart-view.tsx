
import {
    ArrowRight,
    LoaderCircle,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import type { CartItem } from "@/types/cart";

interface CartViewProps {
    cartItems: CartItem[];
    cartTotal: number;
    loading: boolean;
    errorMessage: string;
    updatingProductId: number | null;
    onRetry: () => void;
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    onRemove: (productId: number) => void;
    onCheckout: () => void;
}

function formatPrice(price: number | string) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(price));
}

export function CartView({
    cartItems,
    cartTotal,
    loading,
    errorMessage,
    updatingProductId,
    onRetry,
    onIncrease,
    onDecrease,
    onRemove,
    onCheckout,
}: CartViewProps) {
    return (
        <section className="bg-ink-50 py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <h1 className="mb-8 text-3xl font-semibold text-ink-900">
                    Your cart
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircle
                            size={32}
                            className="animate-spin text-ink-500"
                        />
                    </div>
                ) : errorMessage && cartItems.length === 0 ? (
                    <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-ink-900">
                            Failed to load your cart
                        </h2>

                        <p className="mt-2 text-sm text-ink-500">
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-5 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
                        >
                            Try again
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="w-full rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center py-8 text-center">
                            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-ink-100">
                                <ShoppingBag
                                    size={30}
                                    className="text-ink-900"
                                />
                            </div>

                            <h2 className="text-lg font-semibold text-ink-900">
                                There are no products in the cart.
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">
                                Discover our curated collection of
                                products and start filling your shopping
                                cart.
                            </p>

                            <a
                                href="/products"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800"
                            >
                                Explore the Product Catalog
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        {errorMessage && (
                            <div
                                role="alert"
                                className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
                            >
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col items-start gap-8 lg:flex-row">
                            {/* Cart items */}
                            <div className="w-full rounded-2xl border border-ink-200 bg-white p-6 shadow-sm lg:w-[62%] lg:p-8">
                                {cartItems.map((item) => {
                                    const isUpdating =
                                        updatingProductId !== null;

                                    return (
                                        <div
                                            key={item.product.id}
                                            className="mb-5 flex flex-col items-center gap-5 border-b border-zinc-100 pb-5 last:mb-0 last:border-b-0 last:pb-0 md:flex-row md:items-start"
                                        >
                                            {/* Product image */}
                                            <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100 md:w-28">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                />
                                            </div>

                                            {/* Product information */}
                                            <div className="flex w-full flex-1 flex-col">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <span className="mb-1.5 inline-block rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-medium uppercase text-ink-500">
                                                            {item.product.category.name}
                                                        </span>

                                                        <h2 className="line-clamp-1 text-base font-semibold text-ink-900">
                                                            {item.product.name}
                                                        </h2>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onRemove(item.product.id)
                                                        }
                                                        disabled={isUpdating}
                                                        aria-label={`Remove ${item.product.name} from cart`}
                                                        className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Trash2 size={19} />
                                                    </button>
                                                </div>

                                                <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                                    <div>
                                                        <p className="text-xs text-ink-500">
                                                            {formatPrice(item.product.price)} / pcs
                                                        </p>

                                                        <p className="mt-0.5 text-base font-bold text-zinc-900">
                                                            {formatPrice(
                                                                Number(item.product.price) *
                                                                    item.quantity
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Quantity controls */}
                                                    <div className="flex items-center gap-2 self-start rounded-xl border border-zinc-200/80 bg-zinc-50 p-1 sm:self-auto">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onDecrease(item.product.id)
                                                            }
                                                            disabled={
                                                                isUpdating ||
                                                                item.quantity <= 1
                                                            }
                                                            aria-label={`Decrease ${item.product.name} quantity`}
                                                            className="flex size-8 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-xs transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Minus size={16} />
                                                        </button>

                                                        <span className="w-8 text-center text-sm font-semibold text-zinc-900">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onIncrease(item.product.id)
                                                            }
                                                            disabled={isUpdating}
                                                            aria-label={`Increase ${item.product.name} quantity`}
                                                            className="flex size-8 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-xs transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order summary */}
                            <div className="sticky top-28 flex w-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm lg:w-[38%] lg:p-8">
                                <h2 className="mb-5 border-b border-zinc-100 pb-4 text-xl font-semibold text-ink-900">
                                    Order summary
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between text-ink-600">
                                        <span>Subtotal</span>

                                        <span className="font-medium text-ink-900">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 text-ink-600">
                                        <span>Delivery</span>

                                        <span className="text-right font-medium text-emerald-600">
                                            Calculated at checkout
                                        </span>
                                    </div>
                                </div>

                                <div className="my-6 h-px w-full bg-ink-100" />

                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <span className="text-base font-semibold text-zinc-900">
                                        Total spending
                                    </span>

                                    <span className="text-xl font-semibold text-ink-900">
                                        {formatPrice(cartTotal)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={onCheckout}
                                    disabled={updatingProductId !== null}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-3.5 font-medium text-white shadow-sm transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Continue to checkout

                                    <ArrowRight
                                        size={16}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
