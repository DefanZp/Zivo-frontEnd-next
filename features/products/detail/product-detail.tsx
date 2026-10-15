
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { productService } from "@/lib/services/product-service";
import { cartService } from "@/lib/services/cart-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import type { Product } from "@/types/product";
import { ProductDetailView } from "./product-detail-view";

interface ProductDetailProps {
    id: string;
}

function getCartErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as {
            message?: string;
            errors?: Record<string, string[]>;
        };

        const validationMessage = apiError.errors
            ? Object.values(apiError.errors).flat()[0]
            : undefined;

        if (validationMessage) {
            return validationMessage;
        }

        if (apiError.message) {
            return apiError.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Failed to add product to cart. Please try again.";
}

export function ProductDetail({ id }: ProductDetailProps) {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [addingToCart, setAddingToCart] = useState(false);
    const [checkingCart, setCheckingCart] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const loadProduct = useCallback(async () => {
        try {
            const response = await productService.getProductById(
                Number(id)
            );

            setProduct(response.data);
            setErrorMessage("");
        } catch {
            setErrorMessage(
                "Failed to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void loadProduct();
    }, [loadProduct]);

    const productId = product?.id;

    // Check whether this product is already in the user's cart.
    useEffect(() => {
        let cancelled = false;

        if (!isAuthReady) {
            return () => {
                cancelled = true;
            };
        }

        if (!token || !productId) {
            setIsInCart(false);
            setCheckingCart(false);
            return;
        }

        async function checkCart() {
            setCheckingCart(true);

            try {
                const response = await cartService.getCart(token);

                const found = response.data.items.some(
                    (item) => item.product.id === productId
                );

                if (!cancelled) {
                    setIsInCart(found);
                }
            } catch {
                if (!cancelled) {
                    setIsInCart(false);
                }
            } finally {
                if (!cancelled) {
                    setCheckingCart(false);
                }
            }
        }

        void checkCart();

        return () => {
            cancelled = true;
        };
    }, [isAuthReady, token, productId]);

    function handleRetry() {
        setLoading(true);
        setErrorMessage("");

        void loadProduct();
    }

    async function handleAddToCart() {
        if (!product || addingToCart || checkingCart) {
            return;
        }

        // If the product is already in the cart, open the cart page.
        if (isInCart) {
            router.push("/cart");
            return;
        }

        if (product.stock <= 0) {
            return;
        }

        if (!isAuthReady) {
            toast.info("Please wait a moment and try again.");
            return;
        }

        if (!token) {
            toast.info("Please log in to add products to your cart.");
            router.push("/auth/login");
            return;
        }

        setAddingToCart(true);

        try {
            await cartService.addToCart(token, product.id, 1);

            setIsInCart(true);
            toast.success("Product added to cart.");
        } catch (error) {
            toast.error(getCartErrorMessage(error));
        } finally {
            setAddingToCart(false);
        }
    }

    return (
        <ProductDetailView
            product={product}
            loading={loading}
            errorMessage={errorMessage}
            addingToCart={addingToCart}
            checkingCart={checkingCart}
            isInCart={isInCart}
            onRetry={handleRetry}
            onAddToCart={handleAddToCart}
        />
    );
}
