"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth-store-provider";

export function VerifiedGuard({
    children,
}: {children: React.ReactNode}) {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        if (!user) {
            router.replace("/auth/login");
            return;
        }

        if (!user.email_verified_at) {
            router.replace("/auth/verify-email");
        }
    }, [isAuthReady, user, router]);

    if (!isAuthReady) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                Loading...
            </div>
        );
    }

    if (!user || !user.email_verified_at) {
        return null;
    }

    return <>{children}</>;
}