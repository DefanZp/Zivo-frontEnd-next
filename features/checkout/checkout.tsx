"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addressService } from "@/lib/services/address-service";
import { checkoutService } from "@/lib/services/checkout-service";
import { paymentService } from "@/lib/services/payment-service";
import { cartService } from "@/lib/services/cart-service";

import { CheckoutView } from "@/features/checkout/checkout-view";

import type { Address } from "@/types/address";
import type { Cart } from "@/types/cart";
import type { CheckoutRequest } from "@/types/checkout";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

function getErrorStatus(error: unknown): number | undefined {
    if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof error.status === "number"
    ) {
        return error.status;
    }

    return undefined;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
}

export function Checkout() {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [cart, setCart] = useState<Cart | null>(null);

    const [selectedAddressId, setSelectedAddressId] =
        useState<number | null>(null);

    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loadingCart, setLoadingCart] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [addressError, setAddressError] = useState("");
    const [cartError, setCartError] = useState("");

    const [retryKey, setRetryKey] = useState(0);

    const cartItems = cart?.items ?? [];

    const subtotal = cartItems.reduce((total, item) => {
        return total + Number(item.product.price) * item.quantity;
    }, 0);

    const totalQuantity = cartItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    useEffect(() => {
        if (!token) {
            return;
        }

        let active = true;

        async function loadAddresses(): Promise<void> {
            setLoadingAddresses(true);
            setAddressError("");

            try {
                const response =
                    await addressService.getAddresses(token!);

                if (!active) {
                    return;
                }

                const loadedAddresses = response.data ?? [];

                setAddresses(loadedAddresses);

                setSelectedAddressId((currentId) => {
                    // Pertahankan pilihan pengguna saat memuat ulang.
                    const currentAddressExists = loadedAddresses.some(
                        (address) => address.id === currentId
                    );

                    if (currentId !== null && currentAddressExists) {
                        return currentId;
                    }

                    const defaultAddress = loadedAddresses.find(
                        (address) => address.is_default
                    );

                    return defaultAddress?.id ?? null;
                });
            } catch (error) {
                console.error("Failed to load addresses:", error);

                if (active) {
                    setAddressError(
                        "Failed to load addresses. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoadingAddresses(false);
                }
            }
        }

        async function loadCart(): Promise<void> {
            setLoadingCart(true);
            setCartError("");

            try {
                const response = await cartService.getCart(token!);

                if (active) {
                    setCart(response.data);
                }
            } catch (error) {
                console.error("Failed to load cart:", error);

                if (active) {
                    setCartError(
                        "Failed to load your cart. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoadingCart(false);
                }
            }
        }

        void loadAddresses();
        void loadCart();

        return () => {
            active = false;
        };
    }, [token, retryKey]);

    const retryLoading = useCallback(() => {
        setRetryKey((current) => current + 1);
    }, []);

    function buildCheckoutRequest(
        addressId: number
    ): CheckoutRequest {
        return {
            address_id: addressId,
            items: cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
        };
    }

    function getPaymentResultUrl(gatewayOrderId: string): string {
        return `/payment/result?payment_order_id=${encodeURIComponent(
            gatewayOrderId
        )}`;
    }

    async function handleCheckout(): Promise<void> {
        if (!token || submitting) {
            return;
        }

        if (selectedAddressId === null) {
            toast.error("Please select a shipping address.");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        setSubmitting(true);

        let gatewayOrderId: string | null = null;

        try {
            // 1. Buat order di backend.
            const request = buildCheckoutRequest(selectedAddressId);

            const orderResponse = await checkoutService.createOrder(
                token,
                request
            );

            const payment = orderResponse.data.payment;

            if (!payment?.id || !payment.gateway_order_id) {
                throw new Error(
                    "The order was created, but payment information was not returned."
                );
            }

            gatewayOrderId = payment.gateway_order_id;

            toast.success(
                "Order created successfully. Opening payment..."
            );

            // 2. Kosongkan keranjang setelah order berhasil dibuat.
            // Kegagalan langkah ini tidak boleh menghentikan pembayaran.
            try {
                await cartService.clearCart(token);

                setCart((currentCart) => {
                    if (!currentCart) {
                        return currentCart;
                    }

                    return {
                        ...currentCart,
                        items: [],
                    };
                });
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }

            // 3. Ambil Snap token dari Laravel.
            const tokenResponse = await paymentService.getSnapToken(
                token,
                payment.id
            );

            // 4. Muat script Midtrans di browser.
            await paymentService.loadSnapScript();

            const resultUrl = getPaymentResultUrl(gatewayOrderId);

            // 5. Buka popup pembayaran.
            paymentService.openPayment(
                tokenResponse.data.snap_token,
                {
                    onSuccess: () => {
                        setSubmitting(false);

                        toast.success(
                            "Payment submitted. Checking payment status..."
                        );

                        router.push(resultUrl);
                    },

                    onPending: () => {
                        setSubmitting(false);

                        toast.info(
                            "Payment is still pending. Checking its status..."
                        );

                        router.push(resultUrl);
                    },

                    onError: () => {
                        setSubmitting(false);

                        toast.error(
                            "Payment failed. Checking the latest status..."
                        );

                        router.push(resultUrl);
                    },

                    onClose: () => {
                        setSubmitting(false);

                        toast.info(
                            "Payment window closed. You can check the payment status."
                        );

                        router.push(resultUrl);
                    },
                }
            );
        } catch (error) {
            console.error("Checkout failed:", error);

            const status = getErrorStatus(error);

            if (status === 403) {
                toast.error(
                    "Please verify your email before placing an order."
                );

                router.push("/auth/verify-email");
            } else if (gatewayOrderId) {
                // Order sudah terbentuk. Jangan mengulangi pembuatan order.
                toast.error(
                    "We couldn't open the payment window. Checking your payment..."
                );

                router.push(
                    getPaymentResultUrl(gatewayOrderId)
                );
            } else {
                toast.error(getErrorMessage(error));
            }

            setSubmitting(false);
        }
    }

    return (
        <CheckoutView
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            loadingAddresses={loadingAddresses}
            addressError={addressError}
            onRetry={retryLoading}
            cartItems={cartItems}
            loadingCart={loadingCart}
            cartError={cartError}
            subtotal={subtotal}
            totalQuantity={totalQuantity}
            submitting={submitting}
            onSubmit={handleCheckout}
        />
    );
}
