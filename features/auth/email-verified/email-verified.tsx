
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { EmailVerifiedView } from "./email-verified-view";

export function EmailVerified() {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);
    const setAuth = useAuthStore((state) => state.setAuth);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        if (!token) {
            router.replace("/auth/login");
            return;
        }

        async function refreshUser() {
            try {
                const response = await authService.getCurrentUser(token);

                setAuth(response.data, token);
            } catch {
                setErrorMessage(
                    "Failed to refresh your account status."
                );
            }
        }

        void refreshUser();
    }, [isAuthReady, token, setAuth, router]);

    return (
        <EmailVerifiedView
            errorMessage={errorMessage}
        />
    );
}
