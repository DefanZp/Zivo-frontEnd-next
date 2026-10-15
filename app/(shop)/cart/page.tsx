import { AuthGuard } from "@/components/auth/auth-guard";
import { Cart } from "@/features/cart/cart";

export default function CartPage() {
    return (
        <AuthGuard>
            <Cart />
        </AuthGuard>
    );
}
