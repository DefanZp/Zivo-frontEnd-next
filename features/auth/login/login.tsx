"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { LoginRequest } from "@/types/auth";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/stores/auth-store-provider";

import { LoginView } from "./login-view";

function getLoginErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return "Login failed. Please check your email and password.";
}

export function Login() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(data: LoginRequest): Promise<void> {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await authService.login(data);

            setAuth(response.user, response.token);

            if (response.user.role === "admin") {
                router.push("/admin/dashboard");
                return;
            }

            router.push("/");
        } catch (error: unknown) {
            setErrorMessage(getLoginErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LoginView
            isLoading={isLoading}
            errorMessage={errorMessage}
            onLogin={handleLogin}
        />
    );
}
