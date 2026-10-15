
"use client";

import Image from "next/image";
import Link from "next/link";

import type { Address } from "@/types/address";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface CheckoutViewProps {
    addresses: Address[];
    selectedAddressId: number | null;
    onSelectAddress: (addressId: number) => void;

    loadingAddresses: boolean;
    addressError: string;
    onRetry: () => void;

    cartItems: CartItem[];
    loadingCart: boolean;
    cartError: string;

    subtotal: number;
    totalQuantity: number;

    submitting: boolean;
    onSubmit: () => void;
}

type DisplayProduct = Product & {
    image_url?: string | null;
    image?: string | null;
    category?: unknown;
    category_name?: string | null;
};

function formatPrice(value: number | string): string {
    const amount = Number(value);

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);
}

function getAddressRegions(address: Address): string[] {
    return [
        address.subdistrict_name,
        address.district_name,
        address.city_name,
        address.province_name,
        address.postal_code,
    ].filter((value): value is string => Boolean(value));
}

function getCategoryName(product: Product): string {
    const displayProduct = product as DisplayProduct;
    const category = displayProduct.category;

    if (typeof category === "string") {
        return category;
    }

    if (
        category &&
        typeof category === "object" &&
        "name" in category &&
        typeof category.name === "string"
    ) {
        return category.name;
    }

    return displayProduct.category_name ?? "Product";
}

function getProductImage(product: Product): string | null {
    const displayProduct = product as DisplayProduct;

    return displayProduct.image_url ?? displayProduct.image ?? null;
}

export function CheckoutView({
    addresses,
    selectedAddressId,
    onSelectAddress,
    loadingAddresses,
    addressError,
    onRetry,
    cartItems,
    loadingCart,
    cartError,
    subtotal,
    totalQuantity,
    submitting,
    onSubmit,
}: CheckoutViewProps) {
    return (
        <section className="min-h-[70vh] py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <h1 className="text-2xl font-semibold text-ink-950">
                    Checkout
                </h1>

                <p className="mt-2 text-sm text-ink-500">
                    Review your shipping address and order before payment.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-ink-950">
                                        Shipping Address
                                    </h2>

                                    <p className="mt-1 text-sm text-ink-500">
                                        Choose an address for your order.
                                    </p>
                                </div>

                                <Link
                                    href="/user/settings/addresses"
                                    className="shrink-0 text-sm font-medium text-ink-900 underline underline-offset-4"
                                >
                                    Manage addresses
                                </Link>
                            </div>

                            {loadingAddresses ? (
                                <p className="mt-6 text-sm text-ink-500">
                                    Loading addresses...
                                </p>
                            ) : addressError ? (
                                <div className="mt-5">
                                    <p className="text-sm text-red-600">
                                        {addressError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="mt-3 text-sm font-medium underline underline-offset-4"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="mt-6 rounded-xl border border-dashed border-ink-200 p-6 text-center">
                                    <p className="text-sm text-ink-600">
                                        You don&apos;t have a shipping address yet.
                                    </p>

                                    <Link
                                        href="/user/settings/addresses"
                                        className="mt-4 inline-flex rounded-lg bg-ink-950 px-5 py-3 text-sm font-medium text-white"
                                    >
                                        Add Address
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-3">
                                    {addresses.map((address) => {
                                        const selected =
                                            selectedAddressId === address.id;

                                        const regions = getAddressRegions(address);

                                        return (
                                            <button
                                                key={address.id}
                                                type="button"
                                                onClick={() =>
                                                    onSelectAddress(address.id)
                                                }
                                                aria-pressed={selected}
                                                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                                                    selected
                                                        ? "border-ink-950 bg-ink-50"
                                                        : "border-ink-200 hover:border-ink-400"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span
                                                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                            selected
                                                                ? "border-ink-950"
                                                                : "border-ink-300"
                                                        }`}
                                                    >
                                                        {selected && (
                                                            <span className="h-2 w-2 rounded-full bg-ink-950" />
                                                        )}
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-semibold text-ink-950">
                                                                {address.label ||
                                                                    "Shipping Address"}
                                                            </span>

                                                            {address.is_default && (
                                                                <span className="rounded-full bg-ink-100 px-2 py-1 text-xs text-ink-600">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-2 text-sm font-medium text-ink-900">
                                                            {address.recipient_name}
                                                        </p>

                                                        <p className="mt-1 text-sm text-ink-600">
                                                            {address.phone}
                                                        </p>

                                                        <p className="mt-3 text-sm leading-6 text-ink-600">
                                                            {address.full_address}
                                                        </p>

                                                        {regions.length > 0 && (
                                                            <p className="mt-1 text-sm leading-6 text-ink-500">
                                                                {regions.join(", ")}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="h-fit rounded-2xl border border-ink-200 bg-white p-5 sm:p-7">
                        <h2 className="text-lg font-semibold text-ink-950">
                            Order Summary
                        </h2>

                        <p className="mt-1 text-sm text-ink-500">
                            {totalQuantity} items
                        </p>

                        {loadingCart ? (
                            <p className="mt-6 text-sm text-ink-500">
                                Loading your cart...
                            </p>
                        ) : cartError ? (
                            <div className="mt-6">
                                <p className="text-sm text-red-600">
                                    {cartError}
                                </p>

                                <button
                                    type="button"
                                    onClick={onRetry}
                                    className="mt-3 text-sm font-medium underline underline-offset-4"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div className="mt-6">
                                <p className="text-sm text-ink-500">
                                    Your cart is empty.
                                </p>

                                <Link
                                    href="/products"
                                    className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
                                >
                                    Browse products
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-6 divide-y divide-ink-100">
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    const imageUrl = getProductImage(product);

                                    return (
                                        <div
                                            key={product.id}
                                            className="flex gap-3 py-4 first:pt-0"
                                        >
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center px-2 text-center text-xs text-ink-400">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-ink-500">
                                                    {getCategoryName(product)}
                                                </p>

                                                <p className="mt-1 line-clamp-2 text-sm font-medium text-ink-950">
                                                    {product.name}
                                                </p>

                                                <p className="mt-1 text-xs text-ink-500">
                                                    Qty: {item.quantity}
                                                </p>

                                                <p className="mt-2 text-sm font-semibold text-ink-950">
                                                    {formatPrice(
                                                        Number(product.price) *
                                                            item.quantity
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-5 space-y-3 border-t border-ink-200 pt-5 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-ink-500">
                                    Subtotal
                                </span>

                                <span className="font-medium text-ink-950">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-ink-500">
                                    Shipping fee
                                </span>

                                <span className="text-ink-500">-</span>
                            </div>

                            <div className="flex justify-between gap-4 border-t border-ink-100 pt-4">
                                <span className="font-semibold text-ink-950">
                                    Total payment
                                </span>

                                <span className="font-semibold text-ink-950">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={
                                submitting ||
                                loadingAddresses ||
                                loadingCart ||
                                Boolean(addressError) ||
                                Boolean(cartError) ||
                                cartItems.length === 0 ||
                                addresses.length === 0
                            }
                            className="mt-6 w-full rounded-lg bg-ink-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Processing..."
                                : "Place Order Now"}
                        </button>

                        <p className="mt-3 text-center text-xs leading-5 text-ink-500">
                            You will continue to Midtrans to complete your payment.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    );
}
