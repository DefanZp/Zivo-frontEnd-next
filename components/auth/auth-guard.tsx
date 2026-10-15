
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth-store-provider";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        if (!token || !user) {
            router.replace("/auth/login");
        }
    }, [isAuthReady, token, user, router]);

    // Tunggu Zustand memulihkan sesi autentikasi.
    if (!isAuthReady) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                Loading...
            </div>
        );
    }

    // Jangan tampilkan konten jika pengguna belum login.
    if (!token || !user) {
        return null;
    }

    return <>{children}</>;
}
