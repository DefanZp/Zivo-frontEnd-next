"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { LoginRequest } from "@/types/auth";
import { authService } from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { LoginView } from "./login-view";

type LoginFieldErrors = Partial<
    Record<keyof LoginRequest, string>
>;

export function Login() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] =
        useState<LoginFieldErrors>({});

    function handleChange(
        field: keyof LoginRequest,
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

    function validateForm(): LoginFieldErrors {
        const errors: LoginFieldErrors = {};

        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            errors.password = "Password is required.";
        }

        return errors;
    }

    async function handleLogin(): Promise<void> {
        setErrorMessage("");
        setFieldErrors({});

        const errors = validateForm();

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({
                email: formData.email.trim(),
                password: formData.password,
            });

            setAuth(response.user, response.token);

            toast.success("Login successful.");

            if (response.user.role === "admin") {
                router.push("/admin/dashboard");
                return;
            }

            router.push("/");
        } catch (error: unknown) {
            const apiError = error as {
                message?: string;
                errors?: Partial<
                    Record<keyof LoginRequest, string[]>
                >;
            };

            const nextFieldErrors: LoginFieldErrors = {};

            if (apiError.errors) {
                (
                    Object.keys(apiError.errors) as (
                        keyof LoginRequest
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
                        "Login failed. Please check your email and password."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginView
            formData={formData}
            isLoading={isLoading}
            errorMessage={errorMessage}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            onLogin={handleLogin}
        />
    );
}
