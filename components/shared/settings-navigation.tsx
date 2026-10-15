"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    {
        label: "Profile",
        href: "/user/settings",
        exact: true,
    },
    {
        label: "Addresses",
        href: "/user/settings/addresses",
        exact: false,
    },
    {
        label: "Payment Methods",
        href: "/user/settings/payment",
        exact: false,
    },
];

export function SettingsNavigation() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Account settings"
            className="flex gap-8 overflow-x-auto border-b border-ink-200"
        >
            {tabs.map((tab) => {
                const active = tab.exact
                    ? pathname === tab.href
                    : pathname.startsWith(tab.href);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={active ? "page" : undefined}
                        className={`shrink-0 border-b-2 pb-3 text-sm transition ${
                            active
                                ? "border-ink-950 font-semibold text-ink-950"
                                : "border-transparent text-ink-500 hover:text-ink-950"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}