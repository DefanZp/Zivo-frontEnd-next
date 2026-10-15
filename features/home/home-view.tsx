
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Gem,
    RefreshCw,
    ShieldCheck,
    Star,
    Truck,
} from "lucide-react";

import type { Product } from "@/types/product";

interface HomeViewProps {
    products: Product[];
    loading: boolean;
    errorMessage: string;
    onRetry: () => void | Promise<void>;
}

const benefits = [
    {
    icon: <Truck size={21} strokeWidth={1.5} />,
    title: "Complimentary Shipping",
    description: "On all orders over $50",
    },
    {
    icon: <ShieldCheck size={21} strokeWidth={1.5} />,
    title: "Secure Payments",
    description: "Encrypted checkout system",
    },
    {
    icon: <Gem size={21} strokeWidth={1.5} />,
    title: "Curated Quality",
    description: "Selected premium materials",
    },
    {
    icon: <RefreshCw size={21} strokeWidth={1.5} />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
    },
];

const categories = [
    {
    number: "01",
    name: "Accessories",
    slug: "accessories",
    image: "/background/homepage/accesories.jpg",
    },
    {
    number: "02",
    name: "Clothing",
    slug: "clothing",
    image: "/background/homepage/clothing.jpg",
    },
    {
    number: "03",
    name: "Electronics",
    slug: "electronics",
    image: "/background/homepage/electronics.jpg",
    },
];

const testimonials = [
    {
    quote:
        "The quality of the linen shirt exceeded my expectations. Minimalist design, perfect fit, and incredible attention to detail.",
    name: "Sarah Jenkins",
    },
    {
    quote:
        "Fast shipping and gorgeous packaging. You can truly feel the sustainable materials used in their products. Highly recommended!",
    name: "Marcus Vance",
    },
    {
    quote:
        "Aesthetic perfection. The leather wallet is sleek, holds everything I need, and gets better with age. Will definitely buy again.",
    name: "Elena Rostova",
    },
];

function formatPrice(price: string) {
    return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    }).format(Number(price));
}

export function HomeView({
    products,
    loading,
    errorMessage,
    onRetry,
}: HomeViewProps) {
    return (
    <>
        {/* Hero */}
        <section
            className="-mt-[80px] relative flex min-h-screen flex-col justify-center bg-cover bg-center"
            style={{
            backgroundImage: "url('/background/homepage/hero.jpg')",
            }}
        >
            <div className="absolute inset-0 z-10 bg-black/40" />

            <div className="container relative z-20 mx-auto flex flex-col justify-center px-5 pt-20 lg:px-0">
            <h1 className="mb-6 text-5xl leading-tight font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Defined by
                <br className="hidden sm:block" /> Simplicity.
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-ink-200">
                Discover thoughtfully curated pieces designed for the modern
                lifestyle. Timeless essentials crafted with uncompromising
                quality.
            </p>

            <Link
                href="/products"
                className="group flex w-full items-center justify-center gap-2 self-end rounded-lg bg-white px-8 py-4 text-sm font-medium text-ink-950 shadow-lg transition hover:bg-ink-100 md:w-fit"
            >
                Explore Collection
                <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </Link>
            </div>
        </section>

        {/* Benefits */}
        <section className="border-b border-zinc-200 bg-white py-8">
            <div className="container mx-auto px-5 lg:px-0">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
                {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                    <div className="shrink-0 rounded-lg bg-ink-100 p-2.5 text-ink-900">
                    {benefit.icon}
                    </div>

                    <div>
                    <h3 className="mb-0.5 text-sm font-semibold text-ink-900">
                        {benefit.title}
                    </h3>
                    <p className="text-xs text-ink-500">
                        {benefit.description}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* Categories */}
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-5 lg:px-0">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                <p className="mb-2 text-xs font-medium uppercase text-ink-400">
                    Explore By Category
                </p>
                <h2 className="text-3xl font-semibold text-ink-900">
                    Curated Essentials
                </h2>
                </div>

                <Link
                href="/products"
                className="mt-4 text-xs font-semibold text-ink-900 underline underline-offset-4 transition hover:text-ink-600 md:mt-0"
                >
                View all categories
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                {categories.map((category) => (
                <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    className="group relative block h-[240px] overflow-hidden rounded-xl bg-ink-100 lg:h-[420px]"
                >
                    <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <span className="mb-1 text-xs font-medium uppercase text-ink-300">
                        {category.number} / Collection
                    </span>
                    <h3 className="mb-2 text-2xl font-semibold">
                        {category.name}
                    </h3>
                    <span className="flex items-center gap-2 text-sm font-medium text-ink-200 transition group-hover:text-white">
                        Shop Now
                        <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                        />
                    </span>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </section>

        {/* Featured Products */}
        <section className="border-t border-zinc-100 bg-zinc-50 py-16 md:py-24">
            <div className="container mx-auto px-5 lg:px-0">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                <p className="mb-2 text-xs font-medium uppercase text-ink-400">
                    Handpicked For You
                </p>
                <h2 className="text-3xl font-semibold text-ink-900">
                    Featured Products
                </h2>
                </div>

                <Link
                href="/products"
                className="mt-4 text-xs font-semibold text-ink-900 underline underline-offset-4 transition hover:text-ink-600 md:mt-0"
                >
                View all products
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-ink-200 bg-white"
                    >
                    <div className="aspect-square bg-ink-100" />
                    <div className="space-y-3 p-4">
                        <div className="h-4 w-3/4 rounded bg-ink-100" />
                        <div className="h-3 w-full rounded bg-ink-100" />
                        <div className="h-3 w-1/2 rounded bg-ink-100" />
                        <div className="mt-4 h-6 w-1/3 rounded bg-ink-100" />
                    </div>
                    </div>
                ))
                ) : errorMessage ? (
                <div className="col-span-full flex flex-col items-center py-12 text-center">
                    <h3 className="mb-2 text-lg font-semibold text-ink-900">
                    Failed to load products
                    </h3>
                    <p className="mb-6 text-sm text-ink-500">
                    {errorMessage}
                    </p>
                    <button
                    type="button"
                    onClick={() => void onRetry()}
                    className="rounded-full bg-ink-950 px-6 py-2.5 text-sm text-white transition hover:bg-ink-800"
                    >
                    Try again
                    </button>
                </div>
                ) : products.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                    <h3 className="text-lg font-semibold text-ink-900">
                    No products available yet.
                    </h3>
                </div>
                ) : (
                products.map((product) => (
                    <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 transition-all duration-300 hover:shadow-xl"
                    >
                    <div className="relative aspect-square w-full overflow-hidden bg-ink-100">
                        <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                        />

                        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-ink-900 backdrop-blur">
                        {product.category.name}
                        </span>

                        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                        <p className="line-clamp-1 text-base font-semibold capitalize text-ink-900">
                        {product.name}
                        </p>
                        <p className="mt-1 line-clamp-2 flex-1 text-sm capitalize text-ink-500">
                        {product.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-ink-900">
                            {formatPrice(product.price)}
                        </p>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition group-hover:bg-black group-hover:text-white">
                            <ArrowRight size={16} />
                        </span>
                        </div>
                    </div>
                    </Link>
                ))
                )}
            </div>
            </div>
        </section>

        {/* Brand Philosophy */}
        <section
            id="about"
            className="overflow-hidden bg-white py-16 md:py-24"
        >
            <div className="container mx-auto px-5 lg:px-0">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="relative h-[240px] overflow-hidden rounded-2xl bg-zinc-100 md:h-[320px] lg:h-[550px]">
                <img
                    src="/background/homepage/about.jpg"
                    alt="Craftsmanship and Quality"
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                />

                <div className="absolute bottom-6 left-6 rounded-lg border border-white/20 bg-white/90 px-4 py-2 backdrop-blur-md">
                    <p className="text-xs font-medium text-ink-900">
                    EST. 2026 - CRAFTED WITH CARE
                    </p>
                </div>
                </div>

                <div className="flex flex-col justify-center">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-ink-400">
                    Our Philosophy
                </p>

                <h2 className="mb-6 text-4xl leading-tight font-semibold text-ink-900 md:text-5xl">
                    Crafted with intention. Built to last.
                </h2>

                <p className="mb-6 text-lg leading-relaxed text-ink-600">
                    We design timeless pieces using sustainable materials and
                    ethical manufacturing processes. Every detail is carefully
                    considered to ensure your everyday essentials stand the test
                    of time through seasons.
                </p>

                <p className="mb-8 text-sm leading-relaxed text-ink-500">
                    From the selection of raw fabrics to the final stitch, our
                    commitment to uncompromising quality remains at the heart of
                    everything we create.
                </p>

                <div>
                    <Link
                    href="#about"
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-6 py-3.5 text-sm text-ink-50 shadow-sm transition hover:bg-ink-800 md:w-fit md:justify-start"
                    >
                    Read Our Full Story
                    <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                    />
                    </Link>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-ink-100 bg-ink-50 py-16 md:py-24">
            <div className="container mx-auto px-5 lg:px-0">
            <div className="mx-auto mb-12 text-center">
                <p className="mb-2 text-xs font-medium uppercase text-ink-400">
                Loved By Our Community
                </p>
                <h2 className="text-3xl font-semibold text-ink-900">
                What People Are Saying
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                {testimonials.map((testimonial) => (
                <article
                    key={testimonial.name}
                    className="flex flex-col justify-between rounded-2xl border border-ink-100 bg-white p-8 shadow-sm"
                >
                    <div>
                    <div
                        className="mb-4 flex items-center gap-1 text-amber-500"
                        aria-label="5 out of 5 stars"
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            size={16}
                            fill="currentColor"
                            strokeWidth={1}
                        />
                        ))}
                    </div>

                    <p className="mb-6 text-lg italic text-ink-700">
                        “{testimonial.quote}”
                    </p>
                    </div>

                    <div>
                    <h3 className="text-sm font-semibold text-ink-900">
                        {testimonial.name}
                    </h3>
                    <p className="text-xs font-medium text-ink-400">
                        Verified Buyer
                    </p>
                    </div>
                </article>
                ))}
            </div>
            </div>
        </section>

        {/* Newsletter */}
        <section className="bg-ink-900 py-16 text-white">
            <div className="container mx-auto px-5 lg:px-0">
            <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-xs font-medium uppercase text-ink-400">
                Stay Connected
                </p>
                <h2 className="mb-4 text-3xl font-semibold">
                Join The Zivo Club
                </h2>
                <p className="mb-8 text-lg text-ink-300">
                Subscribe to receive updates, access to exclusive deals, and
                10% off your first order.
                </p>

                <form
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(event) => event.preventDefault()}
                >
                <input
                    type="email"
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    required
                    className="min-w-0 flex-grow rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-zinc-400 transition focus:border-white focus:outline-none"
                />

                <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-ink-50 px-6 py-3.5 text-sm text-ink-900 transition hover:bg-ink-100"
                >
                    Subscribe
                </button>
                </form>

                <p className="mt-4 text-xs text-ink-500">
                By subscribing you agree to our Terms of Service and Privacy
                Policy.
                </p>
            </div>
            </div>
        </section>
        </>
    );
}
