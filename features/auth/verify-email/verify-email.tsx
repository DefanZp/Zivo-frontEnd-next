"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { VerifyEmailView } from "./verify-email-view";

function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return "Failed to resend verification email.";
}

export function VerifyEmail() {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    const [loading, setLoading] = useState(false);

    async function handleResendVerificationEmail(): Promise<void> {
        if (loading || !token) {
            return;
        }

        setLoading(true);

        try {
            const response =
                await authService.resendVerificationEmail(token);

            toast.success(response.message);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    if (!user || !token) {
        return (
            <div
                className="container mx-auto px-5 py-20 text-center"
                role="status"
            >
                Loading account...
            </div>
        );
    }

    return (
        <VerifyEmailView
            email={user.email}
            loading={loading}
            onResend={handleResendVerificationEmail}
        />
    );
}