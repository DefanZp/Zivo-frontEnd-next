"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { productService } from "@/lib/services/product-service";
import { categoryService } from "@/lib/services/category-service";

import type {
    GetProductsParams,
    Product,
    ProductCategory,
} from "@/types/product";

import { ProductsView } from "./products-view";

const sortOptions = [
    { label: "Latest", sort: "created_at", direction: "desc" },
    { label: "Lowest Price", sort: "price", direction: "asc" },
    { label: "Highest Price", sort: "price", direction: "desc" },
    { label: "Name A-Z", sort: "name", direction: "asc" },
    { label: "Name Z-A", sort: "name", direction: "desc" },
] as const;

export function Products() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get("category");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortIndex, setSortIndex] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [categoryReady, setCategoryReady] = useState(false);

    // Mengambil daftar kategori dari backend.
    const loadCategories = useCallback(async () => {
        try {
            const response = await categoryService.getCategories();

            setCategories(response.data);
            setCategoriesLoaded(true);
        } catch {
            setErrorMessage(
            "Failed to load categories. Please try again."
            );
            setLoading(false);
        }
    }, []);

    useEffect(() => {

        void loadCategories();

    }, [loadCategories]);

    // Mengubah slug dari URL menjadi ID kategori.
    useEffect(() => {
        if (!categoriesLoaded) {
            return;
        }

        const selectedCategory = categories.find(
            (item) => item.slug === categorySlug
        );

        setCategory(
            selectedCategory ? String(selectedCategory.id) : ""
        );

        setCurrentPage(1);
        setCategoryReady(true);
    }, [categoriesLoaded, categories, categorySlug]);

    // Menunggu 500 ms setelah pengguna berhenti mengetik.
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [search]);

    // Mengambil produk berdasarkan filter yang sedang dipilih.
    const loadProducts = useCallback(
        async (params: GetProductsParams) => {
            try {
                const response = await productService.getProducts(params);
                const result = response.data;

                setProducts(result.data);
                setCurrentPage(result.current_page);
                setLastPage(result.last_page);
            } catch {
                setErrorMessage(
                    "Failed to load products. Please try again."
            );
            } finally {
                setLoading(false);
            }
        },
    []
    );

    // Memuat ulang produk jika filter atau halaman berubah.
    useEffect(() => {

        if (!categoryReady) {
            return;
        }

        const selectedSort = sortOptions[sortIndex] ?? sortOptions[0];

        const params: GetProductsParams = {
            search: debouncedSearch,
            category: category ? Number(category) : undefined,
            sort: selectedSort.sort,
            direction: selectedSort.direction,
            page: currentPage,
        };

        void loadProducts(params);

    }, [
        categoryReady,
        debouncedSearch,
        category,
        sortIndex,
        currentPage,
        loadProducts,
    ]);

    function handleCategoryChange(value: string) {
        setLoading(true);
        setErrorMessage("");
        setCategory(value);
        setCurrentPage(1);
    }

    function handleSortChange(value: number) {
        setLoading(true);
        setErrorMessage("");
        setSortIndex(value);
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        setLoading(true);
        setErrorMessage("");
        
        setCurrentPage(page);

        document.getElementById("product-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const handleRetry = useCallback(() => {
        if (!categoriesLoaded) {
            void loadCategories();
            return;
        }

        const selectedSort = sortOptions[sortIndex] ?? sortOptions[0];

        void loadProducts({
            search: debouncedSearch,
            category: category ? Number(category) : undefined,
            sort: selectedSort.sort,
            direction: selectedSort.direction,
            page: currentPage,
        });
    }, [
    categoriesLoaded,
    loadCategories,
    loadProducts,
    debouncedSearch,
    category,
    sortIndex,
    currentPage,
    ]);

    return (
    <ProductsView
        products={products}
        categories={categories}
        loading={loading}
        errorMessage={errorMessage}
        search={search}
        category={category}
        sortIndex={sortIndex}
        sortOptions={sortOptions}
        currentPage={currentPage}
        lastPage={lastPage}
        onSearchChange={setSearch}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onPageChange={goToPage}
        onRetry={handleRetry}
    />
    );
}
