import { AuthGuard } from "@/components/auth/auth-guard";
import { EmailVerified } from "@/features/auth/email-verified/email-verified";

export default function EmailVerifiedPage() {
    return (
        <AuthGuard>
            <EmailVerified />
        </AuthGuard>
    );
}
