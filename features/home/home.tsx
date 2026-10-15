"use client";

import { useCallback, useEffect, useState } from "react";
import { productService } from "@/lib/services/product-service";
import type { Product } from "@/types/product";
import { HomeView } from "./home-view";


export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
        const response = await productService.getProducts();

        setProducts(response.data.data);
        } catch {
        setErrorMessage(
            "Failed to load products. Please try again."
        );
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    return (
        <HomeView
        products={products}
        loading={loading}
        errorMessage={errorMessage}
        onRetry={loadProducts}
        />
    );
}
