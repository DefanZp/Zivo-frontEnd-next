import { AuthGuard } from "@/components/auth/auth-guard";
import { VerifyEmail } from "@/features/auth/verify-email/verify-email";

export default function VerifyEmailPage() {
    return (
        <AuthGuard>
            <VerifyEmail />
        </AuthGuard>
    );
}