"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { productService } from "@/lib/services/product-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import type { Product } from "@/types/product";

import AdminProductsView from "./admin-products-view";

function getHttpStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    if (!("status" in error)) {
        return undefined;
    }

    const status = (error as { status?: unknown }).status;

    return typeof status === "number" ? status : undefined;
}

export function AdminProducts() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
        null
    );

    const loadProducts = useCallback(
        async (page: number) => {
            if (!token) {
                setLoading(false);
                setErrorMessage(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            setLoading(true);
            setErrorMessage("");

            try {
                const response = await productService.getProducts({ page });

                setProducts(response.data.data);
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
            } catch (error) {
                const status = getHttpStatus(error);

                if (status === 401) {
                    setErrorMessage(
                        "Your session has expired. Please log in again."
                    );
                    return;
                }

                if (status === 403) {
                    setErrorMessage(
                        "You do not have permission to manage products."
                    );
                    return;
                }

                setErrorMessage(
                    "Failed to load products. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        void loadProducts(1);
    }, [loadProducts]);

    function goToPage(page: number) {
        if (
            loading ||
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        void loadProducts(page);

        document
            .getElementById("admin-products-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }

    function goToCreateProduct() {
        router.push("/admin/products/create");
    }

    function goToEditProduct(productId: number) {
        router.push(`/admin/products/${productId}/edit`);
    }

    function openDeleteModal(productId: number) {
        setProductIdToDelete(productId);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        if (deleting) {
            return;
        }

        setProductIdToDelete(null);
        setShowDeleteModal(false);
    }

    async function handleDeleteProduct() {
        if (!token || productIdToDelete === null || deleting) {
            return;
        }

        setDeleting(true);

        try {
            await productService.deleteProduct(token, productIdToDelete);

            toast.success("Product deleted successfully.");

            setShowDeleteModal(false);
            setProductIdToDelete(null);

            // Kembali ke halaman sebelumnya jika produk terakhir
            // pada halaman saat ini berhasil dihapus.
            const nextPage =
                products.length === 1 && currentPage > 1
                    ? currentPage - 1
                    : currentPage;

            await loadProducts(nextPage);
        } catch (error) {
            const status = getHttpStatus(error);

            if (status === 401) {
                toast.error(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (status === 403) {
                toast.error(
                    "You do not have permission to delete products."
                );
                return;
            }

            toast.error("Failed to delete product.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <AdminProductsView
                products={products}
                loading={loading}
                errorMessage={errorMessage}
                currentPage={currentPage}
                lastPage={lastPage}
                onRetry={() => void loadProducts(currentPage)}
                onPageChange={goToPage}
                onCreateProduct={goToCreateProduct}
                onEditProduct={goToEditProduct}
                onDeleteProduct={openDeleteModal}
            />

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete product"
                description="This product will be permanently deleted. This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
                isLoading={deleting}
                variant="danger"
                onConfirm={handleDeleteProduct}
                onCancel={closeDeleteModal}
            />
        </>
    );
}