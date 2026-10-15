"use client";

import type {
    ChangeEvent,
    FormEvent,
} from "react";

import { Button } from "@/components/ui/button";

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
}

interface AdminProductFormViewProps {
    isEditMode: boolean;
    formData: ProductFormData;
    imagePreview: string | null;
    imageError: string;
    loading: boolean;
    submitting: boolean;
    errorMessage: string;
    onInputChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export function AdminProductFormView({
    isEditMode,
    formData,
    imagePreview,
    imageError,
    loading,
    submitting,
    errorMessage,
    onInputChange,
    onImageChange,
    onSubmit,
    onCancel,
}: AdminProductFormViewProps) {
    if (loading) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                Loading product details...
            </div>
        );
    }

    if (errorMessage) {
        return (
            <section className="container mx-auto px-5 py-12">
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700"
                >
                    <p>{errorMessage}</p>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={onCancel}
                    >
                        Back to products
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto space-y-8 px-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                        Store management / Products
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                        {isEditMode ? "Edit Product" : "Add Product"}
                    </h1>

                    <p className="mt-2 text-sm text-ink-500">
                        {isEditMode
                            ? "Update product information and inventory."
                            : "Add a new product to your store."}
                    </p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="grid gap-6 rounded-xl border border-ink-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Product Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            maxLength={255}
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Product name"
                            className="h-11 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="category_id"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Category ID
                        </label>

                        <input
                            id="category_id"
                            name="category_id"
                            type="number"
                            min={1}
                            step={1}
                            required
                            value={formData.category_id}
                            onChange={onInputChange}
                            className="h-11 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Product Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={5}
                            value={formData.description}
                            onChange={onInputChange}
                            placeholder="Describe your product"
                            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Price (IDR)
                        </label>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            min={0}
                            step="any"
                            required
                            value={formData.price}
                            onChange={onInputChange}
                            className="h-11 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="stock"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Stock
                        </label>

                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min={0}
                            step={1}
                            required
                            value={formData.stock}
                            onChange={onInputChange}
                            className="h-11 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100"
                        />
                    </div>

                    <div className="space-y-3 sm:col-span-2">
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Product Image

                            {isEditMode && (
                                <span className="ml-2 font-normal text-ink-500">
                                    (Optional)
                                </span>
                            )}
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={onImageChange}
                            className="block w-full rounded-lg border border-ink-200 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-sm file:font-medium"
                        />

                        <p className="text-xs text-ink-500">
                            JPEG, PNG, or WebP. Maximum file size: 5 MB.
                        </p>

                        {imageError && (
                            <p
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {imageError}
                            </p>
                        )}

                        {imagePreview && (
                            <div className="space-y-2">
                                <p className="text-sm text-ink-500">
                                    {isEditMode
                                        ? "Product image preview"
                                        : "Image preview"}
                                </p>

                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="size-40 rounded-lg border border-ink-200 object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Saving..."
                                : isEditMode
                                ? "Update Product"
                                : "Create Product"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}