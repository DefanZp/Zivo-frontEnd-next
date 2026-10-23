"use client";

import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { productService } from "@/lib/services/product-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import type { Product } from "@/types/product";

import {
    AdminProductFormView,
    type ProductFormData,
} from "./admin-product-form-view";

interface AdminProductFormProps {
    productId?: number;
}

const initialFormData: ProductFormData = {
    name: "",
    description: "",
    price: "1",
    stock: "1",
    category_id: "1",
    specifications: [],
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

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

export function AdminProductForm({
    productId,
}: AdminProductFormProps) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    const isEditMode = productId !== undefined;

    const [formData, setFormData] =
        useState<ProductFormData>(initialFormData);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState("");

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadProduct = useCallback(async () => {
        if (!isEditMode || productId === undefined) {
            setLoading(false);
            return;
        }

        if (!token) {
            setErrorMessage(
                "Your session has expired. Please log in again."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response =
                await productService.getProductById(productId);

            const product: Product = response.data;

            setFormData({
                name: product.name,
                description: product.description,
                price: String(product.price),
                stock: String(product.stock),
                category_id: String(product.category_id),
                specifications: Object.entries(
                    product.specifications ?? {}
                ).map(([key, value]) => ({
                    key,
                    value: Array.isArray(value)
                        ? value.join(", ")
                        : value == null
                            ? ""
                            : String(value),
                })),
            });

            setImagePreview(product.image_url || null);
        } catch (error) {
            const status = getHttpStatus(error);

            if (status === 401) {
                setErrorMessage(
                    "Your session has expired. Please log in again."
                );
            } else if (status === 403) {
                setErrorMessage(
                    "You do not have permission to manage products."
                );
            } else if (status === 404) {
                setErrorMessage("This product could not be found.");
            } else {
                setErrorMessage(
                    "Failed to load product details. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [isEditMode, productId, token]);

    useEffect(() => {
        void loadProduct();
    }, [loadProduct]);

    // Buat preview lokal dan bersihkan URL saat gambar diganti.
    useEffect(() => {
        if (!selectedImage) {
            return;
        }

        const previewUrl = URL.createObjectURL(selectedImage);
        setImagePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [selectedImage]);

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    function handleSpecificationChange(
        index: number,
        field: "key" | "value",
        value: string
    ) {
        setFormData((currentData) => ({
            ...currentData,
            specifications: currentData.specifications.map(
                (specification, currentIndex) =>
                    currentIndex === index
                        ? { ...specification, [field]: value }
                        : specification
            ),
        }));
    }

    function handleAddSpecification() {
        setFormData((currentData) => ({
            ...currentData,
            specifications: [
                ...currentData.specifications,
                { key: "", value: "" },
            ],
        }));
    }

    function handleRemoveSpecification(index: number) {
        setFormData((currentData) => ({
            ...currentData,
            specifications: currentData.specifications.filter(
                (_, currentIndex) => currentIndex !== index
            ),
        }));
    }

    function normalizeSpecificationKey(key: string): string {
        return key.trim().toLowerCase().replace(/\s+/g, "_");
    }

    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const input = event.target;
        const file = input.files?.[0];

        setImageError("");

        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError("Choose a JPEG, PNG, or WebP image.");
            input.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setImageError("Image size must not exceed 5 MB.");
            input.value = "";
            return;
        }

        setSelectedImage(file);
    }

    function validateForm(): boolean {
        const price = Number(formData.price);
        const stock = Number(formData.stock);
        const categoryId = Number(formData.category_id);

        if (
            !formData.name.trim() ||
            formData.name.trim().length > 255
        ) {
            toast.error(
                "Product name is required and must be at most 255 characters."
            );
            return false;
        }

        if (!formData.description.trim()) {
            toast.error("Product description is required.");
            return false;
        }

        if (
            !formData.price.trim() ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            toast.error(
                "Enter a valid price greater than or equal to 0."
            );
            return false;
        }

        if (
            !formData.stock.trim() ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            toast.error(
                "Stock must be a non-negative integer."
            );
            return false;
        }

        if (
            !formData.category_id.trim() ||
            !Number.isInteger(categoryId) ||
            categoryId < 1
        ) {
            toast.error("Enter a valid category ID.");
            return false;
        }

        if (imageError) {
            toast.error("Please select a valid product image.");
            return false;
        }

        if (!isEditMode && !selectedImage) {
            setImageError("Product image is required.");
            toast.error("Please select a product image.");
            return false;
        }

        const specifications = formData.specifications.filter(
            (item) => item.key.trim() || item.value.trim()
        );

        const hasIncompleteSpecification = specifications.some(
            (item) => !item.key.trim() || !item.value.trim()
        );

        if (hasIncompleteSpecification) {
            toast.error("Please complete both attribute and value.");
            return false;
        }

        const keys = specifications.map((item) =>
            normalizeSpecificationKey(item.key)
        );

        if (new Set(keys).size !== keys.length) {
            toast.error("Each specification attribute must be unique.");
            return false;
        }

        return true;
    }

    function buildFormData(): FormData {
        const data = new FormData();

        data.append("name", formData.name.trim());
        data.append("description", formData.description.trim());
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category_id);
        
        const specifications = Object.fromEntries(
            formData.specifications
                .filter((item) => item.key.trim() && item.value.trim())
                .map((item) => [
                    normalizeSpecificationKey(item.key),
                    item.value.trim(),
                ])
        );

        data.append("specifications", JSON.stringify(specifications));

        if (selectedImage) {
            data.append("image", selectedImage);
        }

        return data;
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (submitting || loading) {
            return;
        }

        if (!token) {
            toast.error(
                "Your session has expired. Please log in again."
            );
            return;
        }

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const data = buildFormData();

            if (isEditMode && productId !== undefined) {
                await productService.updateProduct(
                    token,
                    productId,
                    data
                );

                toast.success("Product updated successfully.");
            } else {
                await productService.createProduct(token, data);

                toast.success("Product created successfully.");
            }

            router.push("/admin/products");
        } catch (error) {
            const status = getHttpStatus(error);

            if (status === 401) {
                toast.error(
                    "Your session has expired. Please log in again."
                );
            } else if (status === 403) {
                toast.error(
                    "You do not have permission to save this product."
                );
            } else if (status === 422) {
                toast.error(
                    "Some product data is invalid. Please check your inputs."
                );
            } else {
                toast.error(
                    isEditMode
                        ? "Failed to update product."
                        : "Failed to create product."
                );
            }
        } finally {
            setSubmitting(false);
        }
    }

    function handleCancel() {
        router.push("/admin/products");
    }

    return (
        <AdminProductFormView
            isEditMode={isEditMode}
            formData={formData}
            imagePreview={imagePreview}
            imageError={imageError}
            loading={loading}
            submitting={submitting}
            errorMessage={errorMessage}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSpecificationChange={handleSpecificationChange}
            onAddSpecification={handleAddSpecification}
            onRemoveSpecification={handleRemoveSpecification}
        />
    );
}