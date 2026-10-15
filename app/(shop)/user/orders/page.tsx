import { AuthGuard } from "@/components/auth/auth-guard";
import { Orders } from "@/features/orders/orders";

export default function OrdersPage() {
    return (
        <AuthGuard>
            <Orders />
        </AuthGuard>
    );
}