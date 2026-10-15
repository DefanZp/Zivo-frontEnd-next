"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";
import type { RegisterRequest } from "@/types/auth";

import { RegisterView } from "./register-view";

type RegisterFieldErrors = Partial<
    Record<keyof RegisterRequest, string>
>;

export function Register() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] =
        useState<RegisterFieldErrors>({});

    function handleChange(
        field: keyof RegisterRequest,
        value: string
    ) {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [field]: "",
        }));

        setErrorMessage("");
    }

    function validateForm(): RegisterFieldErrors {
        const errors: RegisterFieldErrors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required.";
        } else if (formData.name.length > 255) {
            errors.name = "Name must not exceed 255 characters.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = "Please enter a valid email address.";
        } else if (formData.email.length > 255) {
            errors.email = "Email must not exceed 255 characters.";
        }

        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }

        if (!formData.password_confirmation) {
            errors.password_confirmation =
                "Please confirm your password.";
        } else if (
            formData.password !== formData.password_confirmation
        ) {
            errors.password_confirmation =
                "Passwords do not match.";
        }

        return errors;
    }

    async function handleSubmit() {
        setErrorMessage("");

        const errors = validateForm();
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register(formData);

            setAuth(response.user, response.token);

            toast.success("Account created! Please verify your email.");

            router.push("/auth/verify-email");
        } catch (error: unknown) {
            const apiError = error as {
                message?: string;
                errors?: Partial<
                    Record<keyof RegisterRequest, string[]>
                >;
            };

            const nextFieldErrors: RegisterFieldErrors = {};

            if (apiError.errors) {
                (
                    Object.keys(apiError.errors) as (
                        keyof RegisterRequest
                    )[]
                ).forEach((field) => {
                    const message = apiError.errors?.[field]?.[0];

                    if (message) {
                        nextFieldErrors[field] = message;
                    }
                });
            }

            setFieldErrors(nextFieldErrors);

            const hasFieldErrors =
                Object.keys(nextFieldErrors).length > 0;

            setErrorMessage(
                hasFieldErrors
                    ? ""
                    : apiError.message ??
                        "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <RegisterView
            formData={formData}
            loading={loading}
            errorMessage={errorMessage}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}
