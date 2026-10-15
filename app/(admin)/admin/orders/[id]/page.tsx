import { Suspense } from "react";

import { AdminOrderDetail } from "@/features/admin/orders/detail/admin-order-detail";

interface AdminOrderDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function AdminOrderDetailPage({
    params,
}: AdminOrderDetailPageProps) {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-5 py-20 text-center">
                    Loading order details...
                </div>
            }
        >
            <AdminOrderDetailPageContent params={params} />
        </Suspense>
    );
}

async function AdminOrderDetailPageContent({
    params,
}: AdminOrderDetailPageProps) {
    const { id } = await params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                <h1 className="text-xl font-semibold text-ink-900">
                    Invalid order ID
                </h1>
            </div>
        );
    }

    return (
        <AdminOrderDetail
            key={id}
            id={id}
        />
    );
}
