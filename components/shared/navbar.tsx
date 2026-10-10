"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ChevronDown,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    X,
} from "lucide-react";

import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/stores/auth-store-provider";


import type { User } from "@/types/auth";
import { ConfirmationModal } from "./confirmation-modal";


export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const navbarRef = useRef<HTMLDivElement>(null);

    // Authentication state from Zustand.
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const isAuthReady = useAuthStore((state) => state.isAuthReady);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    // Navbar UI state.
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isLoggedIn = user !== null && token !== null;
    const isAdmin = user?.role === "admin";

    // Close menus when clicking outside the Navbar.
    useEffect(() => {
        function handleDocumentClick(event: MouseEvent) {
            const navbar = navbarRef.current;

            if (!navbar || navbar.contains(event.target as Node)) {
                return;
            }

            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
        }

        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleDocumentClick
            );
        };
    }, []);

    function closeMenus() {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
    }

    function toggleProfileMenu() {
        setIsProfileMenuOpen((previous) => !previous);
    }

    function toggleMobileMenu() {
        setIsMobileMenuOpen((previous) => !previous);
    }

    function openLogoutModal() {
        closeMenus();
        setIsLogoutModalOpen(true);
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
            closeMenus();
            setIsLogoutModalOpen(false);
            setIsLoggingOut(false);

            router.replace("/login");
        }
    }

    function getUserInitial(currentUser: User | null) {
        return currentUser?.name?.charAt(0)?.toUpperCase() || "U";
    }

    function getNavLinkClass(href: string, exact = false) {
        const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        const baseClass =
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 paragraph-14r transition hover:bg-ink-100 hover:text-zinc-900";

        return `${baseClass} ${
            isActive ? "bg-ink-100 text-zinc-900" : "text-ink-500"
        }`;
    }

    return (
        <>
            <div ref={navbarRef}>
                {/* Announcement Bar */}
                {isAuthReady && !isAdmin && (
                    <div className="bg-ink-950 px-4 py-2.5 text-center text-ink-50">
                        <div className="container mx-auto flex items-center justify-center gap-3">
                            <p className="label-12m">
                                Discover our latest arrivals -{" "}
                                <Link
                                    href="/products"
                                    className="underline underline-offset-4 transition hover:text-ink-300"
                                >
                                    Check out new products
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Navigation */}
                <nav className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-[80px] items-center justify-between px-5 lg:px-0">

                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={closeMenus}
                            className="flex items-center gap-2 no-underline"
                        >
                            <div className="w-[72px]">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={72}
                                    height={40}
                                    priority
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {isAuthReady && isAdmin && (
                                <span className="rounded bg-ink-900 px-1.5 py-0.5 text-[10px] font-medium text-ink-50">
                                    Admin
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navbar */}
                        <div className="hidden items-center gap-1 md:flex">
                            {!isAuthReady ? (
                                <div
                                    className="h-8 w-20 animate-pulse rounded-lg bg-ink-100"
                                    aria-hidden="true"
                                />
                            ) : (
                                <>
                                    {/* Admin Navigation */}
                                    {isAdmin ? (
                                        <>
                                            <Link
                                                href="/admin/dashboard"
                                                className={getNavLinkClass("/admin/dashboard")}
                                                onClick={closeMenus}
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>

                                            <Link
                                                href="/admin/products"
                                                className={getNavLinkClass("/admin/products")}
                                                onClick={closeMenus}
                                            >
                                                <Package size={16} />
                                                Products
                                            </Link>

                                            <Link
                                                href="/admin/orders"
                                                className={getNavLinkClass("/admin/orders")}
                                                onClick={closeMenus}
                                            >
                                                <ClipboardList size={16} />
                                                Orders
                                            </Link>

                                            <div className="mx-1 h-5 w-px bg-zinc-200" />

                                            <Link
                                                href="/products"
                                                className={getNavLinkClass("/products", true)}
                                                onClick={closeMenus}
                                            >
                                                <ShoppingBag size={16} />
                                                Shop
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/products"
                                                className={getNavLinkClass("/products", true)}
                                                onClick={closeMenus}
                                            >
                                                <ShoppingBag size={16} />
                                                Shop
                                            </Link>

                                            {isLoggedIn && (
                                                <Link
                                                    href="/cart"
                                                    className={getNavLinkClass("/cart")}
                                                    onClick={closeMenus}
                                                >
                                                    <ShoppingCart size={16} />
                                                    Cart
                                                </Link>
                                            )}
                                        </>
                                    )}

                                    <div className="mx-1 h-5 w-px bg-zinc-200" />

                                    {/* User Dropdown */}
                                    {isLoggedIn && user ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                aria-expanded={isProfileMenuOpen}
                                                aria-haspopup="menu"
                                                onClick={toggleProfileMenu}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200/80 bg-white p-1.5 pr-2.5 transition hover:bg-ink-100"
                                            >
                                                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-900 paragraph-14s text-white">
                                                    {getUserInitial(user)}
                                                </div>

                                                <div className="flex min-w-0 flex-col text-left">
                                                    <span className="max-w-36 truncate paragraph-14r text-ink-900">
                                                        {user.name}
                                                    </span>

                                                    <span className="mt-0.5 text-[11px] font-medium uppercase text-ink-500">
                                                        {user.role}
                                                    </span>
                                                </div>

                                                <ChevronDown
                                                    size={16}
                                                    className={`text-ink-400 transition-transform duration-200 ${
                                                        isProfileMenuOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </button>

                                            {isProfileMenuOpen && (
                                                <div
                                                    role="menu"
                                                    className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-ink-100 bg-white py-2 shadow-lg"
                                                >
                                                    <div className="border-b border-ink-100 px-4 py-2">
                                                        <p className="truncate paragraph-14r font-semibold text-zinc-900">
                                                            {user.name}
                                                        </p>

                                                        <p className="truncate paragraph-12r text-zinc-500">
                                                            {user.email}
                                                        </p>
                                                    </div>

                                                    <div className="border-b border-ink-100 py-1">
                                                        <Link
                                                            href="/user/orders"
                                                            role="menuitem"
                                                            onClick={closeMenus}
                                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left paragraph-14r text-ink-700 transition hover:bg-ink-50 hover:text-ink-950"
                                                        >
                                                            <ClipboardList size={16} />
                                                            <span className="font-medium">
                                                                My Orders
                                                            </span>
                                                        </Link>

                                                        <Link
                                                            href="/user/settings"
                                                            role="menuitem"
                                                            onClick={closeMenus}
                                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left paragraph-14r text-ink-700 transition hover:bg-ink-50 hover:text-ink-950"
                                                        >
                                                            <Settings size={16} />
                                                            <span className="font-medium">
                                                                Account Settings
                                                            </span>
                                                        </Link>
                                                    </div>

                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            role="menuitem"
                                                            onClick={openLogoutModal}
                                                            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left paragraph-14r text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <LogOut size={16} />
                                                            Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={closeMenus}
                                            className="flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 paragraph-14r text-white transition hover:bg-ink-700"
                                        >
                                            Login
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="flex items-center md:hidden">
                            <button
                                type="button"
                                aria-label={
                                    isMobileMenuOpen
                                        ? "Close navigation menu"
                                        : "Open navigation menu"
                                }
                                aria-expanded={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                                className="rounded-lg p-2 text-zinc-600 transition hover:bg-ink-100 hover:text-zinc-900"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navbar */}
                    {isMobileMenuOpen && (
                        <div className="space-y-3 border-t border-ink-100 bg-white px-5 py-4 shadow-lg md:hidden">
                            {!isAuthReady ? (
                                <div className="h-10 animate-pulse rounded-lg bg-ink-100" />
                            ) : (
                                <>
                                    {isLoggedIn && user && (
                                        <div className="mb-2 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-100/50 p-2.5">
                                            <div className="flex size-9 items-center justify-center rounded-full bg-ink-900 paragraph-14s text-white">
                                                {getUserInitial(user)}
                                            </div>

                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate paragraph-14r text-ink-900">
                                                    {user.name}
                                                </span>

                                                <span className="text-[11px] font-medium uppercase text-zinc-500">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        {isAdmin ? (
                                            <>
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/admin/dashboard")}
                                                >
                                                    <LayoutDashboard size={16} />
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    href="/admin/products"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/admin/products")}
                                                >
                                                    <Package size={16} />
                                                    Products
                                                </Link>

                                                <Link
                                                    href="/admin/orders"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/admin/orders")}
                                                >
                                                    <ClipboardList size={16} />
                                                    Orders
                                                </Link>

                                                <div className="my-1 border-t border-ink-100" />

                                                <Link
                                                    href="/products"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/products", true)}
                                                >
                                                    <ShoppingBag size={16} />
                                                    Shop
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/products"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/products", true)}
                                                >
                                                    <ShoppingBag size={16} />
                                                    Shop
                                                </Link>

                                                {isLoggedIn && (
                                                    <Link
                                                        href="/cart"
                                                        onClick={closeMenus}
                                                        className={getNavLinkClass("/cart")}
                                                    >
                                                        <ShoppingCart size={16} />
                                                        Cart
                                                    </Link>
                                                )}
                                            </>
                                        )}

                                        {isLoggedIn && (
                                            <>
                                                <Link
                                                    href="/user/orders"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/user/orders")}
                                                >
                                                    <ClipboardList size={16} />
                                                    My Orders
                                                </Link>

                                                <Link
                                                    href="/user/settings"
                                                    onClick={closeMenus}
                                                    className={getNavLinkClass("/user/settings")}
                                                >
                                                    <Settings size={16} />
                                                    Account Settings
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    <div className="border-t border-ink-100 pt-3">
                                        {isLoggedIn ? (
                                            <button
                                                type="button"
                                                onClick={openLogoutModal}
                                                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 paragraph-14r text-ink-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        ) : (
                                            <Link
                                                href="/login"
                                                onClick={closeMenus}
                                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink-900 px-3 py-2 paragraph-14r text-white transition hover:bg-ink-700"
                                            >
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>

            {/* Logout Modal */}
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                isLoading={isLoggingOut}
                title="Log out of account?"
                description="You will be logged out of your account and will need to log back in to access this feature."
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