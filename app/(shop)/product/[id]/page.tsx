
import { Suspense } from "react";

import { ProductDetail } from "@/features/products/detail/product-detail";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-5 py-20 text-center">
                    Loading product...
                </div>
            }
        >
            <ProductDetailPageContent params={params} />
        </Suspense>
    );
}

async function ProductDetailPageContent({
    params,
}: ProductDetailPageProps) {
    const { id } = await params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                <h1 className="text-xl font-semibold text-ink-900">
                    Invalid product ID
                </h1>
            </div>
        );
    }

    return (
        <ProductDetail
            key={id}
            id={id}
        />
    );
}
