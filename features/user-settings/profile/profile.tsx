"use client";

import { useState } from "react";
import { toast } from "sonner";

import { userService } from "@/lib/services/user-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { ProfileView } from "@/features/user-settings/profile/profile-view";

interface ProfileErrors {
    name?: string;
    email?: string;
}

export function Profile() {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const setAuth = useAuthStore((state) => state.setAuth);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<ProfileErrors>({});

    function startEditing(): void {
        if (!user) {
            return;
        }

        setName(user.name);
        setEmail(user.email);
        setFieldErrors({});
        setIsEditing(true);
    }

    function cancelEditing(): void {
        if (loading) {
            return;
        }

        setIsEditing(false);
        setFieldErrors({});
    }

    async function saveProfile(): Promise<void> {
        if (!token || !user || loading) {
            return;
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        const errors: ProfileErrors = {};

        if (!trimmedName) {
            errors.name = "Full name is required.";
        } else if (trimmedName.length > 255) {
            errors.name = "Full name must not exceed 255 characters.";
        }

        if (!trimmedEmail) {
            errors.email = "Email address is required.";
        } else if (
            trimmedEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
        ) {
            errors.email = "Please enter a valid email address.";
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const response = await userService.updateProfile(token, {
                name: trimmedName,
                email: trimmedEmail,
            });

            setAuth(response.data, token);
            setIsEditing(false);
            setFieldErrors({});

            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Failed to update profile:", error);

            const apiError = error as {
                errors?: Record<string, string[]>;
            };

            const backendErrors = apiError.errors;

            if (backendErrors) {
                const nextErrors: ProfileErrors = {};

                if (backendErrors.name?.[0]) {
                    nextErrors.name = backendErrors.name[0];
                }

                if (backendErrors.email?.[0]) {
                    nextErrors.email = backendErrors.email[0];
                }

                setFieldErrors(nextErrors);
            }

            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    }

    if (!user || !token) {
        return (
            <div className="flex justify-center py-12" role="status">
                <span className="text-sm text-ink-500">
                    Loading profile...
                </span>
            </div>
        );
    }

    return (
        <ProfileView
            user={user}
            isEditing={isEditing}
            name={name}
            email={email}
            loading={loading}
            fieldErrors={fieldErrors}
            onEdit={startEditing}
            onCancel={cancelEditing}
            onSave={saveProfile}
            onNameChange={setName}
            onEmailChange={setEmail}
        />
    );
}