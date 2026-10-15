
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowUpRight,
    LogOut,
    Menu,
    ShoppingBag,
} from "lucide-react";

import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

interface AdminTopbarProps {
    onMenuClick: () => void;
}

export function AdminTopbar({
    onMenuClick,
}: AdminTopbarProps) {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    function getUserInitial() {
        return user?.name?.charAt(0)?.toUpperCase() || "A";
    }

    function closeLogoutModal() {
        if (isLoggingOut) {
            return;
        }

        setIsLogoutModalOpen(false);
    }

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            if (token) {
                await authService.logout(token);
            }
        } catch (error) {
            console.error("Failed to log out on the server:", error);
        } finally {
            clearAuth();
            setIsLogoutModalOpen(false);
            setIsLoggingOut(false);

            router.replace("/auth/login");
        }
    }

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    {/* Left Section */}
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Open admin navigation"
                            className="rounded-lg p-2 text-ink-600 transition hover:bg-ink-100 lg:hidden"
                        >
                            <Menu className="size-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink-950">
                                Store Management
                            </p>
                            <p className="hidden text-xs text-ink-500 sm:block">
                                Manage your Zivo store
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-950 sm:px-3"
                        >
                            <ShoppingBag className="size-4" />
                            <span className="hidden sm:inline">
                                View Store
                            </span>
                            <ArrowUpRight className="hidden size-3.5 sm:block" />
                        </Link>

                        <div className="h-8 w-px bg-ink-200" />

                        {/* Admin Identity */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-sm font-semibold text-white">
                                {getUserInitial()}
                            </div>

                            <div className="hidden min-w-0 sm:block">
                                <p className="max-w-36 truncate text-sm font-medium text-ink-950">
                                    {user?.name ?? "Admin"}
                                </p>
                                <p className="text-xs text-ink-500">
                                    Administrator
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            aria-label="Log out"
                            title="Log out"
                            className="rounded-lg p-2 text-ink-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut className="size-[18px]" />
                        </button>
                    </div>
                </div>
            </header>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                isLoading={isLoggingOut}
                title="Log out of account?"
                description="You will be logged out of your account and redirected to the login page."
                confirmText="Logout"
                cancelText="Cancel"
                loadingText="Logging out..."
                variant="danger"
                onConfirm={handleLogout}
                onCancel={closeLogoutModal}
            />
        </>
    );
}
