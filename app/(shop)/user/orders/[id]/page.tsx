import { Suspense } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { OrderDetail } from "@/features/orders/detail/order-detail";

interface OrderDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function OrderDetailPage({
    params,
}: OrderDetailPageProps) {
    return (
        <AuthGuard>
            <Suspense
                fallback={
                    <div
                        className="container mx-auto px-5 py-20 text-center"
                        role="status"
                    >
                        Loading order details...
                    </div>
                }
            >
                <OrderDetailPageContent params={params} />
            </Suspense>
        </AuthGuard>
    );
}

async function OrderDetailPageContent({
    params,
}: OrderDetailPageProps) {
    const { id } = await params;
    const orderId = Number(id);

    if (
        !/^\d+$/.test(id) ||
        !Number.isSafeInteger(orderId) ||
        orderId < 1
    ) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                <h1 className="text-xl font-semibold text-ink-950">
                    Invalid Order ID
                </h1>
            </div>
        );
    }

    return <OrderDetail key={id} orderId={orderId} />;
}
