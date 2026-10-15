
import Link from "next/link";
import { Check } from "lucide-react";

interface EmailVerifiedViewProps {
    errorMessage: string;
}

export function EmailVerifiedView({
    errorMessage,
}: EmailVerifiedViewProps) {
    return (
        <section className="min-h-[70vh] py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="w-full max-w-lg">
                        <div className="rounded-2xl border border-ink-200 bg-white p-7 text-center shadow-xs sm:p-10">
                            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-ink-100">
                                <Check
                                    size={32}
                                    strokeWidth={2}
                                    className="text-ink-900"
                                />
                            </div>

                            <h1 className="text-2xl font-semibold text-ink-950">
                                Email Verified
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-500">
                                Your email address has been successfully
                                verified. Your Zivo account is now ready
                                to use.
                            </p>

                            {errorMessage && (
                                <p
                                    role="alert"
                                    className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                >
                                    {errorMessage}
                                </p>
                            )}

                            <div className="my-7 h-px w-full bg-ink-100" />

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/"
                                    className="w-full rounded-lg bg-ink-950 px-5 py-3 text-center text-sm text-white transition-colors hover:bg-ink-800"
                                >
                                    Back to Home
                                </Link>

                                <Link
                                    href="/products"
                                    className="w-full rounded-lg border border-ink-200 px-5 py-3 text-sm text-ink-900 transition-colors hover:bg-ink-50"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
