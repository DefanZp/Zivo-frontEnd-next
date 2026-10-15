
import Link from "next/link";
import { Mail, LoaderCircle } from "lucide-react";

interface VerifyEmailViewProps {
    email: string;
    loading: boolean;
    onResend: () => void | Promise<void>;
}

export function VerifyEmailView({
    email,
    loading,
    onResend,
}: VerifyEmailViewProps) {
    return (
        <section className="min-h-[70vh] py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="w-full max-w-lg">
                        <div className="rounded-2xl border border-ink-200 bg-white p-7 text-center shadow-xs sm:p-10">
                            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-ink-100">
                                <Mail
                                    size={32}
                                    strokeWidth={2}
                                    className="text-ink-900"
                                />
                            </div>

                            <h1 className="text-2xl font-semibold text-ink-950">
                                Verify Your Email
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-500">
                                We have sent a verification link to{" "}
                                <span className="font-semibold text-ink-900">
                                    {email}
                                </span>
                                . Please check your inbox and click the
                                link to verify your account.
                            </p>

                            <div className="my-7 h-px w-full bg-ink-100" />

                            <p className="text-sm text-ink-500">
                                Didn&apos;t receive the email?
                            </p>

                            <button
                                type="button"
                                onClick={() => void onResend()}
                                disabled={loading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink-950 px-5 py-3 text-sm text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading && (
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                {loading
                                    ? "Sending..."
                                    : "Resend Verification Email"}
                            </button>

                            <Link
                                href="/auth/login"
                                className="mt-4 block text-sm text-ink-600 transition-colors hover:text-ink-950"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
