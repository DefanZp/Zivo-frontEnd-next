"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ClipboardList,
    LayoutDashboard,
    Package,
    X,
} from "lucide-react";

interface AdminSidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

const navigationItems = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ClipboardList,
    },
];

interface SidebarContentProps {
    onNavigate: () => void;
    onClose?: () => void;
}

function SidebarContent({
    onNavigate,
    onClose,
}: SidebarContentProps) {
    const pathname = usePathname();

    function isActive(href: string) {
        return (
            pathname === href ||
            pathname.startsWith(`${href}/`)
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-ink-100 px-6">
                <Link
                    href="/admin/dashboard"
                    onClick={onNavigate}
                    className="flex items-center gap-3"
                >
                    <Image
                        src="/logo.png"
                        alt="Zivo"
                        width={64}
                        height={36}
                        priority
                        className="h-auto w-16 object-contain"
                    />

                    <div className="border-l border-ink-200 pl-3">
                        <p className="text-sm font-semibold text-ink-950">
                            Admin Panel
                        </p>
                        <p className="text-xs text-ink-500">
                            Store management
                        </p>
                    </div>
                </Link>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close admin navigation"
                        className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 lg:hidden"
                    >
                        <X className="size-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav
                aria-label="Admin navigation"
                className="flex-1 space-y-6 overflow-y-auto px-4 py-6"
            >
                <div className="space-y-2">
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                        Workspace
                    </p>

                    <div className="space-y-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={
                                        active ? "page" : undefined
                                    }
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? "bg-ink-950 text-ink-50"
                                            : "text-ink-600 hover:bg-ink-100 hover:text-ink-950"
                                    }`}
                                >
                                    <Icon className="size-[18px] shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="shrink-0 border-t border-ink-100 p-4">
                <p className="text-xs leading-5 text-ink-500">
                    Manage your products and orders from one place.
                </p>
                <p className="mt-2 text-[11px] text-ink-400">
                    Zivo Admin
                </p>
            </div>
        </div>
    );
}

function SidebarFallback() {
    return (
        <div className="flex h-full flex-col">
            <div className="h-20 shrink-0 border-b border-ink-100" />
            <div className="flex-1 space-y-3 px-4 py-6">
                <div className="h-3 w-20 rounded bg-ink-100" />
                <div className="h-10 rounded-lg bg-ink-100" />
                <div className="h-10 rounded-lg bg-ink-50" />
                <div className="h-10 rounded-lg bg-ink-50" />
            </div>
            <div className="h-20 shrink-0 border-t border-ink-100" />
        </div>
    );
}

function SidebarContentWithSuspense({
    onNavigate,
    onClose,
}: SidebarContentProps) {
    return (
        <Suspense fallback={<SidebarFallback />}>
            <SidebarContent
                onNavigate={onNavigate}
                onClose={onClose}
            />
        </Suspense>
    );
}

export function AdminSidebar({
    isMobileOpen,
    onClose,
}: AdminSidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-ink-100 bg-white lg:flex">
                <SidebarContentWithSuspense
                    onNavigate={() => {}}
                />
            </aside>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40"
                    />

                    <aside className="absolute inset-y-0 left-0 z-10 w-72 max-w-[85vw] border-r border-ink-100 bg-white shadow-xl">
                        <SidebarContentWithSuspense
                            onNavigate={onClose}
                            onClose={onClose}
                        />
                    </aside>
                </div>
            )}
        </>
    );
}