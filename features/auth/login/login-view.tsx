
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import type { LoginRequest } from "@/types/auth";

interface LoginViewProps {
    isLoading: boolean;
    errorMessage: string;
    onLogin: (data: LoginRequest) => Promise<void>;
}

export function LoginView({
    isLoading,
    errorMessage,
    onLogin,
}: LoginViewProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        void onLogin({
            email: email.trim(),
            password,
        });
    }

    return (
        <section className="py-12">
            <div className="container mx-auto flex items-center justify-center px-5 lg:px-0">
                <div className="flex min-h-fit w-full flex-col overflow-hidden rounded-xl bg-white shadow-md md:min-h-[85vh] md:flex-row">

                    {/* Left panel */}
                    <div
                        style={{
                            backgroundImage: "url('/background/loginbg.jpg')",
                        }}
                        className="relative hidden bg-cover bg-center md:block md:w-[40%]"
                    >
                        <div className="absolute inset-0 z-10 rounded-l-xl bg-linear-to-b from-black/10 to-black/60" />

                        <div className="absolute inset-0 z-20 flex h-full flex-col justify-between p-8">

                            <div className="flex items-center gap-3.5">
                                <div className="w-8">
                                    <Image
                                        src="/zivo-logo-z-only-reverse.png"
                                        alt="Logo"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <div className="heading-24s text-white">
                                    Zivo
                                </div>
                            </div>

                            <div className="w-full">
                                <h2 className="heading-32s mb-3 text-white">
                                    Curated for you.
                                </h2>

                                <p className="paragraph-14r text-ink-200">
                                    Sign in to discover personalized
                                    recommendations and early access
                                    to our newest arrivals.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="flex w-full flex-col items-center justify-center px-4 py-6 md:w-[60%]">

                        <div className="mb-6 w-full max-w-md text-left">
                            <h1 className="heading-24s md:heading-32s text-ink-950">
                                Welcome back
                            </h1>

                            <p className="paragraph-14r mt-2 text-ink-500">
                                Sign in to access your saved items
                                and track your orders.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-md space-y-4 md:space-y-6"
                        >
                            {errorMessage && (
                                <div
                                    className="mb-4 flex items-start rounded-md bg-red-100 p-4 text-sm text-red-700 sm:items-center"
                                    role="alert"
                                >
                                    <svg
                                        className="me-2 mt-0.5 h-4 w-4 shrink-0 sm:mt-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>

                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            {/* Email */}
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-ink-950"
                                >
                                    Your email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    className="block w-full rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-950 outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-200"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-ink-950"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    required
                                    className="block w-full rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-950 outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-200"
                                />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-3"
                                        />
                                    </div>

                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-gray-500 dark:text-gray-300"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>

                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="paragraph-14r flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink-950 px-5 py-2.5 text-white hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>

                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>

                            {/* Register link */}
                            <p className="paragraph-14r text-center text-ink-500 dark:text-gray-400">
                                Don&apos;t have an account yet?{" "}
                                <Link
                                    href="/register"
                                    className="paragraph-14s text-ink-900 hover:underline dark:text-primary-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
