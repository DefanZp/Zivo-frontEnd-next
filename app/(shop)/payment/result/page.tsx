import { Suspense } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { PaymentResult } from "@/features/payment/payment-result";

interface PaymentResultPageProps {
    searchParams: Promise<{
        payment_order_id?: string | string[];
    }>;
}

export default function PaymentResultPage({
    searchParams,
}: PaymentResultPageProps) {
    return (
        <AuthGuard>
            <Suspense
                fallback={
                    <div className="flex min-h-[50vh] items-center justify-center">
                        <p className="text-sm text-ink-500">
                            Loading payment result...
                        </p>
                    </div>
                }
            >
                <PaymentResultContent searchParams={searchParams} />
            </Suspense>
        </AuthGuard>
    );
}

async function PaymentResultContent({
    searchParams,
}: PaymentResultPageProps) {
    const params = await searchParams;
    const value = params.payment_order_id;

    const gatewayOrderId = Array.isArray(value)
        ? value[0]
        : value;

    return (
        <PaymentResult
            gatewayOrderId={gatewayOrderId ?? ""}
        />
    );
}
