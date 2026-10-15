"use client";

import type { User } from "@/types/auth";

interface ProfileViewProps {
    user: User | null;
    isEditing: boolean;
    name: string;
    email: string;
    loading: boolean;
    fieldErrors: {
        name?: string;
        email?: string;
    };

    onEdit: () => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    onNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
}

const inputClassName =
    "mt-2 w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-ink-500 disabled:cursor-not-allowed disabled:bg-ink-50";

export function ProfileView({
    user,
    isEditing,
    name,
    email,
    loading,
    fieldErrors,
    onEdit,
    onCancel,
    onSave,
    onNameChange,
    onEmailChange,
}: ProfileViewProps) {
    if (isEditing) {
        return (
            <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                <div className="border-b border-ink-100 p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-ink-950">
                        Edit Profile
                    </h2>

                    <p className="mt-1 text-sm text-ink-500">
                        Update your personal account information and email address.
                    </p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void onSave();
                    }}
                    className="space-y-5 p-6 md:p-8"
                >
                    <div>
                        <label
                            htmlFor="profile-name"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Full Name
                        </label>

                        <input
                            id="profile-name"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={255}
                            value={name}
                            disabled={loading}
                            onChange={(event) =>
                                onNameChange(event.target.value)
                            }
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={
                                fieldErrors.name
                                    ? "profile-name-error"
                                    : undefined
                            }
                            placeholder="Full name"
                            className={inputClassName}
                        />

                        {fieldErrors.name && (
                            <p
                                id="profile-name-error"
                                role="alert"
                                className="mt-2 text-xs text-red-600"
                            >
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="profile-email"
                            className="block text-sm font-medium text-ink-900"
                        >
                            Email Address
                        </label>

                        <input
                            id="profile-email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={255}
                            value={email}
                            disabled={loading}
                            onChange={(event) =>
                                onEmailChange(event.target.value)
                            }
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={
                                fieldErrors.email
                                    ? "profile-email-error"
                                    : undefined
                            }
                            placeholder="Email address"
                            className={inputClassName}
                        />

                        {fieldErrors.email && (
                            <p
                                id="profile-email-error"
                                role="alert"
                                className="mt-2 text-xs text-red-600"
                            >
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-ink-100 bg-ink-50/50 px-6 py-5">
                <div>
                    <h2 className="text-xl font-semibold text-ink-950">
                        Profile Information
                    </h2>

                    <p className="mt-1 text-sm text-ink-500">
                        Your personal account information and system role.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    disabled={!user}
                    className="shrink-0 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 shadow-sm transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Edit Profile
                </button>
            </div>

            {user ? (
                <div className="space-y-8 p-6">
                    <div className="flex items-center gap-5 border-b border-ink-100 pb-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xl font-bold uppercase text-white shadow-sm">
                            {user.name.trim().charAt(0) || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-ink-950">
                                {user.name}
                            </p>

                            <p className="truncate text-sm text-ink-500">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-base font-semibold text-ink-950">
                            Account Details
                        </h3>

                        <div className="grid grid-cols-1 gap-6 rounded-xl border border-ink-100 bg-ink-50/40 p-5 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase text-ink-400">
                                    Full Name
                                </p>

                                <p className="mt-1 text-sm text-ink-900">
                                    {user.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-ink-400">
                                    Email Address
                                </p>

                                <p className="mt-1 break-all text-sm text-ink-900">
                                    {user.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-ink-400">
                                    Role
                                </p>

                                <span className="mt-1 inline-flex rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium capitalize text-ink-800">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-sm font-medium text-ink-600">
                        Unable to load profile information.
                    </p>

                    <p className="mt-1 text-xs text-ink-400">
                        Please refresh the page or try again later.
                    </p>
                </div>
            )}
        </section>
    );
}
