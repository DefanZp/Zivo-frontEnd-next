import { AuthGuard } from "@/components/auth/auth-guard";
import { VerifiedGuard } from "@/components/auth/verified-guard";
import { Checkout } from "@/features/checkout/checkout";

export default function CheckoutPage() {
    return (
        <AuthGuard>
            <VerifiedGuard>
                <Checkout />
            </VerifiedGuard>
        </AuthGuard>
    );
}
