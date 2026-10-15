import Image from "next/image";
import Link from "next/link";

import type { RegisterRequest } from "@/types/auth";

type RegisterFieldErrors = Partial<
    Record<keyof RegisterRequest, string>
>;

interface RegisterViewProps {
    formData: RegisterRequest;
    loading: boolean;
    errorMessage: string;
    fieldErrors: RegisterFieldErrors;
    onChange: (
        field: keyof RegisterRequest,
        value: string
    ) => void;
    onSubmit: () => void | Promise<void>;
}

export function RegisterView({
    formData,
    loading,
    errorMessage,
    fieldErrors,
    onChange,
    onSubmit,
}: RegisterViewProps) {
    return (
        <section className="py-12">
            <div className="container mx-auto flex items-center justify-center px-5 lg:px-0">
                <div className="flex min-h-fit w-full flex-col overflow-hidden rounded-xl bg-white shadow-md md:min-h-[85vh] md:flex-row">
                    {/* Left side: Brand information */}
                    <div
                        className="relative hidden bg-cover bg-center md:block md:w-[40%]"
                        style={{
                            backgroundImage:
                                "url('/background/registerbg.jpg')",
                        }}
                    >
                        <div className="absolute inset-0 z-10 rounded-l-xl bg-gradient-to-b from-black/10 to-black/60" />

                        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                            <div className="flex items-center gap-3.5">
                                <div className="w-8">
                                    <Image
                                        src="/zivo-logo-z-only-reverse.png"
                                        alt="Zivo Logo"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <span className="text-2xl font-semibold text-white">
                                    Zivo
                                </span>
                            </div>

                            <div>
                                <h2 className="mb-3 text-3xl font-semibold text-white">
                                    Elevate your everyday style.
                                </h2>

                                <p className="text-sm text-ink-200">
                                    Join our community to discover
                                    thoughtfully curated collections and
                                    gain early access to exclusive drops.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Registration form */}
                    <div className="flex w-full flex-col items-center justify-center px-4 py-6 md:w-[60%]">
                        <div className="mb-6 w-full max-w-md text-left">
                            <h1 className="text-2xl font-semibold text-ink-950 md:text-3xl">
                                Start making your account
                            </h1>

                            <p className="mt-2 text-sm text-ink-500">
                                Join us today to get the best shopping
                                experience.
                            </p>
                        </div>

                        <form
                            noValidate
                            onSubmit={(event) => {
                                event.preventDefault();
                                void onSubmit();
                            }}
                            className="w-full max-w-md space-y-4 md:space-y-6"
                        >
                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2 rounded-md bg-red-100 p-4 text-sm text-red-700"
                                >
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-ink-900"
                                >
                                    Your name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(event) =>
                                        onChange("name", event.target.value)
                                    }
                                    placeholder="John"
                                    aria-invalid={Boolean(fieldErrors.name)}
                                    className="h-12 w-full rounded-lg border border-ink-200 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-400"
                                />

                                {fieldErrors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-ink-900"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(event) =>
                                        onChange("email", event.target.value)
                                    }
                                    placeholder="name@example.com"
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    className="h-12 w-full rounded-lg border border-ink-200 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-400"
                                />

                                {fieldErrors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password fields */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-ink-900"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={(event) =>
                                            onChange(
                                                "password",
                                                event.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        aria-invalid={Boolean(
                                            fieldErrors.password
                                        )}
                                        className="h-12 w-full rounded-lg border border-ink-200 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-400"
                                    />

                                    {fieldErrors.password && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {fieldErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-medium text-ink-900"
                                    >
                                        Confirm Password
                                    </label>

                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.password_confirmation}
                                        onChange={(event) =>
                                            onChange(
                                                "password_confirmation",
                                                event.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        aria-invalid={Boolean(
                                            fieldErrors.password_confirmation
                                        )}
                                        className="h-12 w-full rounded-lg border border-ink-200 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-400"
                                    />

                                    {fieldErrors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {fieldErrors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink-950 px-5 py-3 text-sm text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading && (
                                    <span
                                        className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                        aria-hidden="true"
                                    />
                                )}

                                {loading ? "Signing up..." : "Sign up"}
                            </button>

                            <p className="text-center text-sm text-ink-500">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-semibold text-ink-900 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
