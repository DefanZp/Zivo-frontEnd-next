import { AdminProductForm } from "@/features/admin/products/form/admin-product-form";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;
    const productId = Number(id);

    if (!/^\d+$/.test(id) || productId < 1) {
        return (
            <section className="container mx-auto px-5 py-20">
                <h1 className="text-xl font-semibold text-ink-900">
                    Invalid product ID
                </h1>
            </section>
        );
    }

    return <AdminProductForm productId={productId} />;
}