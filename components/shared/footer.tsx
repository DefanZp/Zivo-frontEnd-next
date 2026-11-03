import Image from "next/image";
import Link from "next/link";

const footerGroups = [
    {
        title: "Explore",
        links: [
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: "Cart", href: "/cart" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "My Orders", href: "/user/orders" },
            { label: "Account Settings", href: "/user/settings" },
            { label: "Login", href: "/auth/login" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-ink-200 bg-ink-50">
            <div className="container mx-auto px-5 lg:px-0">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.7fr_0.7fr] lg:gap-20 lg:py-16">

                    {/* Brand */}
                    <div className="max-w-md">
                        <Link href="/" aria-label="Zivo homepage">
                            <Image
                                src="/logo.png"
                                alt="Zivo"
                                width={72}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        <p className="paragraph-14r mt-5 max-w-sm text-ink-500">
                            Discover products, explore new arrivals, and
                            enjoy a simple shopping experience with Zivo.
                        </p>
                    </div>

                    {/* Navigation */}
                    {footerGroups.map((group) => (
                        <nav
                            key={group.title}
                            aria-label={group.title}
                            className="space-y-5"
                        >
                            <h2 className="label-12m text-ink-400">
                                {group.title}
                            </h2>

                            <ul className="space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="paragraph-14r text-ink-600 transition-colors hover:text-ink-950"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col gap-3 border-t border-ink-200 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="paragraph-12r text-ink-500">
                        © 2026 Zivo.
                        All rights reserved.
                    </p>

                    <p className="paragraph-12r text-ink-500">
                        E-commerce, made simple.
                    </p>
                </div>
            </div>
        </footer>
    );
}
