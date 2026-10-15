"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth-store-provider";

interface AdminGuardProps {
    children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);

    useEffect(() => {
        if (!isAuthReady) {
            return;
        }

        if (!token || !user) {
            router.replace("/auth/login");
            return;
        }

        if (user.role !== "admin") {
            router.replace("/");
        }
    }, [isAuthReady, token, user, router]);

    // Tunggu Zustand menyelesaikan proses pemulihan autentikasi.
    if (!isAuthReady) {
        return (
            <div className="container mx-auto px-5 py-20 text-center">
                Loading...
            </div>
        );
    }

    // Jangan tampilkan konten admin jika belum login.
    if (!token || !user) {
        return null;
    }

    // Jangan tampilkan konten admin kepada customer.
    if (user.role !== "admin") {
        return null;
    }

    return <>{children}</>;
}
