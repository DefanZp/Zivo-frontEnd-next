import { AuthGuard } from "@/components/auth/auth-guard";
import { SettingsNavigation } from "@/components/shared/settings-navigation";
import type { ReactNode } from "react";

export default function UserSettingsLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AuthGuard>
            <section className="min-h-screen bg-ink-50 py-12">
                <div className="container mx-auto px-5 lg:px-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-ink-950">
                            Account Settings
                        </h1>

                        <p className="mt-1 text-sm text-ink-500">
                            Manage your account and preferences.
                        </p>
                    </div>

                    <SettingsNavigation />

                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </section>
        </AuthGuard>
    );
}